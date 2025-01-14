import spotifyLogo from '@/assets/svgs/spotify-icon.svg'
import { Link } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'
import { Button } from './ui/button'

export const NoSpotifyPremiumButton = () => {
  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger className='font-poppins' asChild>
        <div className='flex h-12 w-fit cursor-pointer items-center gap-2 rounded-md px-4 text-sm font-semibold hover:bg-background/20'>
          <img src={spotifyLogo} alt='spotify' className='h-5' />
          No Premium
        </div>
      </HoverCardTrigger>
      <HoverCardContent className='w-8sd0 font-poppins'>
        <div className='flex justify-between space-x-4'>
          <img src={spotifyLogo} alt='spotify' className='h-10' />
          <div className='space-y-1'>
            <div className='flex items-center justify-between'>
              <h4 className='text-sm font-semibold'>Premium not found</h4>
            </div>
            <p className='text-xs text-muted-foreground'>
              Music player requires a premium account to play music.
            </p>
            <Button
              asChild
              size='sm'
              variant='secondary'
              className='h-auto items-center gap-2 rounded-md py-2 text-xs text-foreground'
            >
              <a
                href='https://www.spotify.com/premium/'
                target='_blank'
                rel='noreferrer'
              >
                Get Premium <Link className='size-4' />
              </a>
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
