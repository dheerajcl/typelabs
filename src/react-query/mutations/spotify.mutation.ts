import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { usePlayerDevice } from 'react-spotify-web-playback-sdk'

export function useGoToPreviousTrack(opts: UseMutationOptions = {}) {
  const device = usePlayerDevice()
  return useMutation({
    mutationFn: async () => {
      if (!device) return
      window.spotifyClient.player.skipToPrevious(device.device_id)
    },
    mutationKey: ['previousTrack'],
    ...opts,
  })
}

export function useGoToNextTrack(opts: UseMutationOptions = {}) {
  const device = usePlayerDevice()
  return useMutation({
    mutationFn: async () => {
      if (!device) return
      window.spotifyClient.player.skipToNext(device.device_id)
    },
    mutationKey: ['nextTrack'],
    ...opts,
  })
}
