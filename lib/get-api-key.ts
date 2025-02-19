export function getApiKey(envKey: string): string | null {
  // First try environment variable
  const envValue = process.env[envKey]
  if (envValue) {
    return envValue
  }

  // Then try localStorage if we're in the browser
  if (typeof window !== 'undefined') {
    const savedKeys = localStorage.getItem('api_keys')
    if (savedKeys) {
      const keys = JSON.parse(savedKeys)
      return keys[envKey] || null
    }
  }

  return null
} 