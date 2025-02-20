// Get API key from environment variables or localStorage
export function getApiKey(keyName: string, req?: Request): string | null {
  // Check environment variable first
  if (process.env[keyName]) {
    return process.env[keyName] || null;
  }

  // If request exists, try to get from headers
  if (req) {
    try {
      const apiKeys = JSON.parse(req.headers.get('x-api-keys') || '{}');
      return apiKeys[keyName] || null;
    } catch (error) {
      console.error('Error parsing API keys from headers:', error);
    }
  }

  return null;
} 