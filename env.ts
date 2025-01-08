const CLIENT_ID = import.meta.env.VITE_CLIENT_ID
if (!CLIENT_ID) throw new Error('No client id provided')

export const env = {
  CLIENT_ID,
}
