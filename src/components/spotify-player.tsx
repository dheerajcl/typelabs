import { useUserQuery } from '@/react-query/queries/spotify.query'
import { NoSpotifyPremiumButton } from './no-spotify-premium-button'
import { ConnectSpotifyButton } from './spotify-music-player/connect-spotify-button'
import { SpotifyDrawer } from './spotify-music-player/spotify-drawer'

export function SpotifyPlayer() {
  const { data: user } = useUserQuery()

  if (!user) return <ConnectSpotifyButton />

  const product = user?.['product' as keyof typeof user]
  if (product !== 'premium') return <NoSpotifyPremiumButton />

  return <SpotifyDrawer />
}
