import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuth2Callback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        
        const token    = params.get('token');
        const email    = params.get('email');
        const fullName = params.get('fullName');
        const userId   = params.get('userId');
        const rawRole  = params.get('role');
        const error    = params.get('error');

        if (error) {
            navigate('/login?error=google', { replace: true });
            return;
        }

        if (!token) {
            navigate('/login?error=no_token', { replace: true });
            return;
        }

        let role = (rawRole || '').toUpperCase().trim();
        if (role === 'ADMIN') role = 'AGENT';

        localStorage.setItem('token', token);
        
        const user = {
            userId:   userId || '',
            fullName: fullName || email || '',
            email:    email || '',
            role:     role,
            active:   true
        };
        localStorage.setItem('user', JSON.stringify(user));

        const hasRole = role && role !== '' && role !== 'NULL' && role !== 'UNDEFINED';
        
        if (hasRole) {
            const roleDashboardMap = {
                'AGENT':          '/agent/dashboard',
                'BUYER':          '/dashboard',
                'SELLER':         '/dashboard',
                'BANK':           '/bank/dashboard',
                'LEGAL_REVIEWER': '/legal/dashboard',
            };
            const redirectPath = roleDashboardMap[role] || '/dashboard';
            window.location.href = redirectPath;
        } else {
            window.location.href = '/select-role';
        }
        
    }, [location.search, navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#f8f9fa'
        }}>
            <div style={{
                width: '60px',
                height: '60px',
                border: '6px solid #e2e8f0',
                borderTop: '6px solid #059669',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '24px'
            }}></div>
            <h2 style={{ color: '#0f172a', fontWeight: '700', fontSize: '20px', marginBottom: '8px' }}>Logging you in...</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Please wait while we complete your Google authentication.</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}