import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { AnimatedPlayIcon } from '@/components/compound-ui/animated-play-icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/class-names.utils'
import { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk'

type PlaylistTabProps = {
  playlist: SimplifiedPlaylist
  isBeingPlayed: boolean
  isActive: boolean
  onClick: () => void
}

export const PlaylistTab = (props: PlaylistTabProps) => {
  return (
    <Button
      onClick={props.onClick}
      variant='ghost'
      size='icon'
      className={cn(
        'relative justify-normal gap-4 whitespace-normal rounded-lg border border-transparent p-1 text-left hover:bg-muted focus:border-2 focus:border-foreground focus-visible:ring-0 md:min-w-[15rem]',
        'h-12 w-12 justify-center',
        'md:w-auto md:justify-start md:px-4',
        {
          'border-primary/50 bg-primary/20 shadow-sm focus:border-primary/50':
            props.isActive,
        },
      )}
      tooltipContent={props.playlist.name}
      tooltipContentProps={{
        className: 'md:hidden',
      }}
    >
      <img
        src={props.playlist.images?.[0].url || defaultPlaylistIcon}
        className='h-8 w-8 rounded-sm'
      />
      <span className='hidden animate-in slide-in-from-left-10 md:block'>
        {props.playlist.name}
      </span>
      {props.isBeingPlayed && (
        <AnimatedPlayIcon
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-0 md:top-0 md:translate-x-0 md:translate-y-0'
          barProps={{
            className: props.isActive
              ? 'bg-primary'
              : 'bg-primary md:bg-foreground/50',
          }}
        />
      )}
    </Button>
  )
}
