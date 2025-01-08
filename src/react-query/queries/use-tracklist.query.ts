import { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'
import { useInfiniteQuery } from '@tanstack/react-query'
import { QK } from '@/config/react-query.config'

const ITEMS_PER_PAGE = 50
const fetchTrackList = async (pageParam: number, playlistId: string) => {
  const offset = pageParam * ITEMS_PER_PAGE
  const res = await spotifyClient.playlists.getPlaylistItems(
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
