import { z } from 'zod'

const envSchema = z.object({
  CLIENT_ID: z.string(),
  REDIRECT_URI: z.string(),
  SERVER_URL: z.string(),
})

export const env = envSchema.parse(viteEnvParser(import.meta.env))

function viteEnvParser(env: Record<string, string>) {
  const envObj = {} as Record<string, string>
  for (const [key, value] of Object.entries(env)) {
    const newKey = key.replace(/VITE_/, '')
    envObj[newKey] = value
  }
  return envObj
}
