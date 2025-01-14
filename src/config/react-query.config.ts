import { QueryClient } from '@tanstack/react-query'

export const QK = {
  SPOTIFY: {
    ROOT: 'SPOTIFY',
    PLAYLIST: 'PLAYLIST',
    CURRENT_USER: {
      ROOT: 'CURRENT_USER',
      PLAYLIST: 'MY_PLAYLIST',
    },
    TRACKLIST: 'TRACKLIST',
  },
}

export const queryClient = new QueryClient()
