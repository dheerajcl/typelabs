import { useQuery } from '@tanstack/react-query'
import { QK } from '@/config/react-query.config'
import { spotifyClient } from '@/config/spotify-client.config'

export const useMyPlaylists = () => {
  return useQuery({
    queryKey: [
      QK.SPOTIFY.ROOT,
      QK.SPOTIFY.CURRENT_USER.ROOT,
      QK.SPOTIFY.CURRENT_USER.PLAYLIST,
    ],
    queryFn: () => spotifyClient.currentUser.playlists.playlists(50),
    refetchOnWindowFocus: false,
    refetchInterval: false,
    staleTime: 60 * 60 * 1000,
    retry: true,
  })
}
