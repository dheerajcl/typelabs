import { Track } from '@spotify/web-api-ts-sdk'

export const getTrackKey = (track: Track | Spotify.Track) =>
  `${track?.name}-${track?.album.name}-${track?.artists[0].name}`

export const getTrackUrl = (id: string) =>
  `https://open.spotify.com/track/${id}`

export const getAlbumUrl = (id: string) =>
  `https://open.spotify.com/album/${id}`

export const getArtistUrl = (id: string) =>
  `https://open.spotify.com/artist/${id}`
