import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { QK } from '@/config/react-query.config'
import { User } from '@spotify/web-api-ts-sdk'
import { spotifyClient } from '@/config/spotify-client.config'

type UserQueryProps = UseQueryOptions<User>
export const useUserQuery = (opts: Partial<UserQueryProps> = {}) =>
  useQuery({
    queryKey: [QK.SPOTIFY, QK.SPOTIFY.CURRENT_USER],
    queryFn: () => spotifyClient.currentUser.profile(),
    ...opts,
  })
