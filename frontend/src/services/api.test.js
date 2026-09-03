var mockApiClient;

jest.mock('axios', () => {
  mockApiClient = {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
  };
  return { create: jest.fn(() => mockApiClient) };
});

import { authService, resolveApiBaseUrl, resolveBackendBaseUrl } from './api';

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
