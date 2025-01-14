import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { env } from 'root/env'

declare global {
  let spotifyClient: SpotifyApi
  interface Window {
    spotifyClient: SpotifyApi
  }
}

export function initSpotifyClient() {
  const spotifyClient = SpotifyApi.withUserAuthorization(
    env.SPOTIFY_CLIENT_ID,
    window.location.origin,
    Scopes.all,
  )
  spotifyClient.authenticate()
  window.spotifyClient = spotifyClient
}

const spotifyAuthLocalStorageKeys = [
  'spotify-sdk:AuthorizationCodeWithPKCEStrategy:token',
  'spotify-sdk:verifier',
]

export const isSpotifyAuthed = spotifyAuthLocalStorageKeys.some((k) =>
  localStorage.getItem(k),
)

if (isSpotifyAuthed) initSpotifyClient()
