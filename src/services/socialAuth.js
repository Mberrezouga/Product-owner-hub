import { OAUTH_MODE, GOOGLE_CONFIG, MICROSOFT_CONFIG, MOCK_SOCIAL_USERS } from '../config/oauth.config';

// Generate random state for OAuth security
const generateState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Google OAuth Login
export const loginWithGoogle = () => {
  if (OAUTH_MODE === 'mock') {
    // Mock login - return mock user data
    return Promise.resolve({
      success: true,
      user: MOCK_SOCIAL_USERS.google,
      isMock: true,
    });
  }

  // Real OAuth flow
  if (!GOOGLE_CONFIG.clientId) {
    console.error('Google Client ID not configured');
    return Promise.reject(new Error('Google OAuth not configured. Please add REACT_APP_GOOGLE_CLIENT_ID to your .env file.'));
  }

  const state = generateState();
  sessionStorage.setItem('oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: 'code',
    scope: GOOGLE_CONFIG.scope,
    state: state,
    access_type: 'online',
  });

  // Redirect to Google OAuth
  window.location.href = `${GOOGLE_CONFIG.authEndpoint}?${params.toString()}`;
  
  return new Promise(() => {}); // Promise never resolves as page redirects
};

// Microsoft OAuth Login
export const loginWithMicrosoft = () => {
  if (OAUTH_MODE === 'mock') {
    // Mock login - return mock user data
    return Promise.resolve({
      success: true,
      user: MOCK_SOCIAL_USERS.microsoft,
      isMock: true,
    });
  }

  // Real OAuth flow
  if (!MICROSOFT_CONFIG.clientId) {
    console.error('Microsoft Client ID not configured');
    return Promise.reject(new Error('Microsoft OAuth not configured. Please add REACT_APP_MICROSOFT_CLIENT_ID to your .env file.'));
  }

  const state = generateState();
  sessionStorage.setItem('oauth_state', state);
  
  const params = new URLSearchParams({
    client_id: MICROSOFT_CONFIG.clientId,
    redirect_uri: MICROSOFT_CONFIG.redirectUri,
    response_type: 'code',
    scope: MICROSOFT_CONFIG.scope,
    state: state,
    response_mode: 'query',
  });

  // Redirect to Microsoft OAuth
  const authUrl = MICROSOFT_CONFIG.authEndpoint.replace('/common/', `/${MICROSOFT_CONFIG.tenantId}/`);
  window.location.href = `${authUrl}?${params.toString()}`;
  
  return new Promise(() => {}); // Promise never resolves as page redirects
};

// Handle OAuth callback (for real OAuth)
export const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const storedState = sessionStorage.getItem('oauth_state');

  if (!code || !state || state !== storedState) {
    return { success: false, error: 'Invalid OAuth callback' };
  }

  // In real implementation, exchange code for token on backend
  // For now, return success
  sessionStorage.removeItem('oauth_state');
  
  return {
    success: true,
    code,
    // Backend should handle token exchange and return user data
  };
};
