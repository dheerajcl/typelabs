import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query'
import { QK } from '@/config/react-query.config'
import { PlaylistedTrack, Track, User } from '@spotify/web-api-ts-sdk'

// PLAYLIST ////////////////////////////////////////////////////
export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: [QK.SPOTIFY.ROOT, QK.SPOTIFY.PLAYLIST, playlistId],
    queryFn: () => window.spotifyClient.playlists.getPlaylist(playlistId),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: true,
  })
}

// MY PLAYLISTS ////////////////////////////////////////////////////
export const useMyPlaylists = () => {
  return useQuery({
    queryKey: [
      QK.SPOTIFY.ROOT,
      QK.SPOTIFY.CURRENT_USER.ROOT,
      QK.SPOTIFY.CURRENT_USER.PLAYLIST,
    ],
    queryFn: () => window.spotifyClient.currentUser.playlists.playlists(50),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 60 * 60 * 1000,
    retry: true,
  })
}

// SPOTIFY USER ////////////////////////////////////////////////////
type UserQueryProps = UseQueryOptions<User>
export const useUserQuery = (opts: Partial<UserQueryProps> = {}) =>
  useQuery({
    queryKey: [QK.SPOTIFY, QK.SPOTIFY.CURRENT_USER],
    queryFn: () => window.spotifyClient.currentUser.profile(),
    ...opts,
  })

// TRACK LIST ////////////////////////////////////////////////////
const ITEMS_PER_PAGE = 50
const fetchTrackList = async (pageParam: number, playlistId: string) => {
  const offset = pageParam * ITEMS_PER_PAGE
  const res = await window.spotifyClient.playlists.getPlaylistItems(
    playlistId,
    undefined,
    undefined,
    ITEMS_PER_PAGE,
    offset,
  )
  return {
    items: res.items,
    next: pageParam + 1,
  }
}

export const useTrackListQuery = (
  playlistId: string,
  initial?: PlaylistedTrack<Track>[],
) => {
  const initialData = initial
    ? {
        pages: [
          {
            items: initial,
            next: 1,
          },
        ],
        pageParams: [0],
      }
    : undefined

  return useInfiniteQuery({
    queryKey: [QK.SPOTIFY.ROOT, QK.SPOTIFY.TRACKLIST, playlistId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchTrackList(pageParam, playlistId),
    getNextPageParam: (lastPage) => lastPage.next,
    initialData,
  })
}
