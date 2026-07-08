const _env = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
} as const

type EnvKey = keyof typeof _env

function requireEnv(key: EnvKey): string {
  const value = _env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
} as const
