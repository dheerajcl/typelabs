import { useQuery } from '@tanstack/react-query'
import { QK } from '@/config/react-query.config'

export const usePlaylist = (playlistId: string) => {
  return useQuery({
    queryKey: [QK.SPOTIFY.ROOT, QK.SPOTIFY.PLAYLIST, playlistId],
    queryFn: () => spotifyClient.playlists.getPlaylist(playlistId),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: true,
  })
}
