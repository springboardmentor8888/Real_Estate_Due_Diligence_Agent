var mockApiClient;

jest.mock('axios', () => {
  mockApiClient = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return { create: jest.fn(() => mockApiClient) };
});

import {
  authService,
  dueDiligenceService,
  comparablesService,
  riskAssessmentService,
  resolveApiBaseUrl,
  resolveBackendBaseUrl,
  resolveGoogleOAuthUrl
} from './api';

describe('API configuration helpers', () => {
  it('trims a trailing slash from the API URL', () => {
    expect(resolveApiBaseUrl('https://example.com/api/')).toBe('https://example.com/api');
  });

  it('derives the backend root URL correctly', () => {
    expect(resolveBackendBaseUrl('https://example.com/api')).toBe('https://example.com');
  });

  it('uses the default localhost value when env is unset', () => {
    expect(resolveApiBaseUrl()).toBe('http://localhost:8080/api');
    expect(resolveBackendBaseUrl()).toBe('http://localhost:8080');
  });

  it('automatically migrates deprecated 3fag URL to the new staging backend', () => {
    expect(resolveApiBaseUrl('https://real-estate-backend-3fag.onrender.com/api'))
      .toBe('https://real-estate-due-diligence-agent.onrender.com/api');
    expect(resolveApiBaseUrl('https://real-estate-backend-3fag.onrender.com/api/'))
      .toBe('https://real-estate-due-diligence-agent.onrender.com/api');
    expect(resolveBackendBaseUrl('https://real-estate-backend-3fag.onrender.com/api'))
      .toBe('https://real-estate-due-diligence-agent.onrender.com');
  });

  it('falls back to the active staging backend in production when env is unset', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalApiUrl = process.env.REACT_APP_API_URL;
    try {
      process.env.NODE_ENV = 'production';
      delete process.env.REACT_APP_API_URL;
      expect(resolveApiBaseUrl()).toBe('https://real-estate-due-diligence-agent.onrender.com/api');
      expect(resolveBackendBaseUrl()).toBe('https://real-estate-due-diligence-agent.onrender.com');
    } finally {
      process.env.NODE_ENV = originalEnv;
      if (originalApiUrl !== undefined) {
        process.env.REACT_APP_API_URL = originalApiUrl;
      }
    }
  });

  it('resolves Google OAuth URL to the active staging backend and never the legacy URL', () => {
    expect(resolveGoogleOAuthUrl('https://real-estate-backend-3fag.onrender.com'))
      .toBe('https://real-estate-due-diligence-agent.onrender.com/oauth2/authorization/google?prompt=select_account');
    expect(resolveGoogleOAuthUrl('https://real-estate-due-diligence-agent.onrender.com'))
      .toBe('https://real-estate-due-diligence-agent.onrender.com/oauth2/authorization/google?prompt=select_account');
    expect(resolveGoogleOAuthUrl(''))
      .toBe('https://real-estate-due-diligence-agent.onrender.com/oauth2/authorization/google?prompt=select_account');
    expect(resolveGoogleOAuthUrl('http://localhost:8080'))
      .toBe('http://localhost:8080/oauth2/authorization/google?prompt=select_account');
  });

  it('preserves a registration email-delivery failure for the UI to display', async () => {
    const unavailable = {
      response: {
        status: 503,
        data: { message: 'Unable to send the verification email. Please try again later.' },
      },
    };
    const payload = { fullName: 'Ava Agent', email: 'ava@example.test', password: 'StrongPass123!', role: 'AGENT' };
    mockApiClient.post.mockRejectedValueOnce(unavailable);

    await expect(authService.register(payload)).rejects.toBe(unavailable);
    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', payload);
  });

  it('calls resendVerification with email payload', async () => {
    mockApiClient.post.mockResolvedValueOnce({
      data: { message: 'If an unverified account exists with that email, a verification link has been sent.' }
    });
    const result = await authService.resendVerification('test@example.com');
    expect(mockApiClient.post).toHaveBeenCalledWith('/auth/resend-verification', { email: 'test@example.com' });
    expect(result.data.message).toContain('verification link has been sent');
  });

  it('supports registration response when token is null and verification is required', async () => {
    const successResponse = {
      data: {
        token: null,
        userId: 42,
        email: 'agent@example.com',
        role: 'AGENT',
        message: 'Registration successful. Check your email to verify your account before logging in.'
      }
    };
    mockApiClient.post.mockResolvedValueOnce(successResponse);
    const result = await authService.register({
      fullName: 'Agent Smith',
      email: 'agent@example.com',
      password: 'StrongPassword123!',
      role: 'AGENT'
    });
    expect(result.data.token).toBeNull();
    expect(result.data.email).toBe('agent@example.com');
    expect(result.data.role).toBe('AGENT');
  });
});

describe('Milestone 3 Due Diligence Report, PDF & Excel Exports', () => {
  it('creates due diligence report via POST /reports', async () => {
    const payload = {
      propertyId: 10,
      reportName: 'Commercial Due Diligence',
      executiveSummary: 'Inspected premises and confirmed clean title',
      reportStatus: 'COMPLETED'
    };
    mockApiClient.post.mockResolvedValueOnce({ data: { reportId: 99, ...payload } });

    const result = await dueDiligenceService.createReport(payload);
    expect(mockApiClient.post).toHaveBeenCalledWith('/reports', payload);
    expect(result.data.reportId).toBe(99);
  });

  it('downloads PDF report by ID via GET /reports/{id}/pdf', async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: new Blob(['%PDF-1.3']) });
    await dueDiligenceService.downloadPdf(99);
    expect(mockApiClient.get).toHaveBeenCalledWith('/reports/99/pdf', { responseType: 'blob' });
  });

  it('downloads Excel report by ID via GET /reports/{id}/excel', async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: new Blob(['xlsx binary']) });
    await dueDiligenceService.downloadExcel(99);
    expect(mockApiClient.get).toHaveBeenCalledWith('/reports/99/excel', { responseType: 'blob' });
  });

  it('downloads property direct PDF and Excel', async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: new Blob(['%PDF-1.3']) });
    await dueDiligenceService.downloadPropertyPdf(10);
    expect(mockApiClient.get).toHaveBeenCalledWith('/reports/property/10/pdf', { responseType: 'blob' });

    mockApiClient.get.mockResolvedValueOnce({ data: new Blob(['xlsx binary']) });
    await dueDiligenceService.downloadPropertyExcel(10);
    expect(mockApiClient.get).toHaveBeenCalledWith('/reports/property/10/excel', { responseType: 'blob' });
  });

  it('fetches real risk assessments for a property', async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: [{ assessmentId: 1, riskScore: 25.0 }] });
    const res = await riskAssessmentService.getByProperty(10);
    expect(mockApiClient.get).toHaveBeenCalledWith('/risk-assessments/property/10');
    expect(res.data).toHaveLength(1);
  });

  it('fetches real comparables for a property', async () => {
    mockApiClient.get.mockResolvedValueOnce({ data: [{ comparableId: 5, comparisonPrice: 450000 }] });
    const res = await comparablesService.getByProperty(10);
    expect(mockApiClient.get).toHaveBeenCalledWith('/market-analysis/property/10');
    expect(res.data).toHaveLength(1);
  });
});

describe('Property Directory Pagination, Search, Details & Dashboard APIs', () => {
  it('fetches paginated property catalog with page and size parameters', async () => {
    const mockPageResponse = {
      data: {
        content: [
          { propertyId: 1, propertyCode: 'SYN-RES-0001', propertyName: 'Highland Creek Estate #1' },
          { propertyId: 2, propertyCode: 'SYN-RES-0002', propertyName: 'Sunset View Residence #2' }
        ],
        totalPages: 26,
        totalElements: 504,
        number: 0,
        size: 20
      }
    };
    mockApiClient.get.mockResolvedValueOnce(mockPageResponse);

    const { propertyService } = await import('./api');
    const result = await propertyService.getAll({ page: 0, size: 20 });

    expect(mockApiClient.get).toHaveBeenCalledWith('/properties/all', { params: { page: 0, size: 20 } });
    expect(result.data.content).toHaveLength(2);
    expect(result.data.totalElements).toBe(504);
  });

  it('supports text query search across property catalog', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: {
        content: [
          { propertyId: 1, propertyCode: 'SYN-RES-0001', propertyName: 'Highland Creek Estate #1' }
        ],
        totalPages: 1,
        totalElements: 1
      }
    });

    const { propertyService } = await import('./api');
    const result = await propertyService.getAll({ page: 0, size: 20, query: 'Austin' });

    expect(mockApiClient.get).toHaveBeenCalledWith('/properties/all', { params: { page: 0, size: 20, query: 'Austin' } });
    expect(result.data.content[0].propertyCode).toBe('SYN-RES-0001');
  });

  it('fetches single property details by ID', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: {
        propertyId: 10,
        propertyCode: 'SYN-RES-0010',
        propertyName: 'Beacon Point Villa #10',
        marketValue: 465000
      }
    });

    const { propertyService } = await import('./api');
    const result = await propertyService.getPropertyById(10);

    expect(mockApiClient.get).toHaveBeenCalledWith('/properties/10');
    expect(result.data.propertyCode).toBe('SYN-RES-0010');
  });

  it('fetches role-based dashboard stats', async () => {
    mockApiClient.get.mockResolvedValueOnce({
      data: {
        role: 'BUYER',
        totalProperties: 504,
        pendingReviews: 126
      }
    });

    const { dashboardService } = await import('./api');
    const result = await dashboardService.getStats('BUYER');

    expect(mockApiClient.get).toHaveBeenCalledWith('/dashboard/stats', { params: { role: 'BUYER' } });
    expect(result.data.totalProperties).toBe(504);
  });
});
