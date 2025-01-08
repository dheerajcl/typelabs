// import SpotifyWebApi from 'spotify-web-api-node'
import { Scopes, SpotifyApi } from '@spotify/web-api-ts-sdk'
import { env } from 'root/env'

export const spotifyClient = SpotifyApi.withUserAuthorization(
  env.CLIENT_ID,
  window.location.origin,
  Scopes.all,
)
