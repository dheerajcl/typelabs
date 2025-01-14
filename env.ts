const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
if (!SPOTIFY_CLIENT_ID) throw new Error('No client id provided')

export const env = {
  SPOTIFY_CLIENT_ID,
}
