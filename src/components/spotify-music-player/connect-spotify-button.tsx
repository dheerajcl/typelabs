import { Button } from '@/components/ui/button'
import spotifyIcon from '@/assets/svgs/spotify-icon.svg'
import { initSpotifyClient } from '@/lib/spotify'

export const ConnectSpotifyButton = () => {
  return (
    <Button
      onClick={initSpotifyClient}
      variant='ghost'
      className='group relative items-center gap-2'
    >
      <img className='h-4 w-4' src={spotifyIcon} /> Connect Spotify
    </Button>
  )
}
