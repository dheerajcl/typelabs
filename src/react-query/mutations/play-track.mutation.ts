import { useMutation } from '@tanstack/react-query'
import { spotifyClient } from '@/config/spotify-client.config'
import { usePlayerContext } from '@/state/atoms'

export const usePlayTrack = (options?: {
  onSuccess?: () => void
  onError?: () => void
  onSettled?: () => void
}) => {
  const [context] = usePlayerContext()
  return useMutation({
    mutationFn: (options?: SpotifyApi.PlayParameterObject) =>
      spotifyClient.play(options),
    onSuccess: () => {
      spotifyClient.setRepeat('context')
      spotifyClient.setShuffle(!!context?.shuffle)
      options?.onSuccess?.()
    },
    onError: () => {
      options?.onError?.()
    },
    onSettled: () => {
      options?.onSettled?.()
    },
    mutationKey: ['play-track'],
  })
}
