// import { useMutation } from '@tanstack/react-query'
// import { spotifyClient } from '@/config/spotify-client.config'
// import { AppStore } from '@/state/atoms'

// export const usePlayTrack = (options?: {
//   onSuccess?: () => void
//   onError?: () => void
//   onSettled?: () => void
// }) => {
//   const { playerContext } = AppStore.useStore('playerContext')
//   return useMutation({
//     mutationFn: (options?: t) =>
//       spotifyClient.play(options),
//     onSuccess: () => {
//       spotifyClient.setRepeat('context')
//       spotifyClient.setShuffle(!!playerContext?.shuffle)
//       options?.onSuccess?.()
//     },
//     onError: () => {
//       options?.onError?.()
//     },
//     onSettled: () => {
//       options?.onSettled?.()
//     },
//     mutationKey: ['play-track'],
//   })
// }
