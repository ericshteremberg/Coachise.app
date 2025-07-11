import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6871397309e8f14984f45ac9", 
  requiresAuth: true // Ensure authentication is required for all operations
});
