// OAuth Configuration for Social Login
// This file contains configuration for Google and Microsoft OAuth integration

// MODE: Set to 'mock' for demo/testing or 'real' for production OAuth
export const OAUTH_MODE = process.env.REACT_APP_OAUTH_MODE || 'mock';

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || window.location.origin,
  scope: 'email profile',
  authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

// Microsoft OAuth Configuration
export const MICROSOFT_CONFIG = {
  clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID || '',
  tenantId: process.env.REACT_APP_MICROSOFT_TENANT_ID || 'common',
  redirectUri: process.env.REACT_APP_OAUTH_REDIRECT_URI || window.location.origin,
  scope: 'openid profile email',
  authEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenEndpoint: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
};

// Check if OAuth is properly configured
export const isOAuthConfigured = () => {
  if (OAUTH_MODE === 'mock') return true;
  return !!(GOOGLE_CONFIG.clientId || MICROSOFT_CONFIG.clientId);
};

// Mock user data for demo mode
export const MOCK_SOCIAL_USERS = {
  google: {
    email: 'user@gmail.com',
    name: 'Google User',
    provider: 'google',
    avatar: 'https://lh3.googleusercontent.com/a/default-user',
  },
  microsoft: {
    email: 'user@outlook.com',
    name: 'Microsoft User',
    provider: 'microsoft',
    avatar: 'https://graph.microsoft.com/v1.0/me/photo/$value',
  },
};
