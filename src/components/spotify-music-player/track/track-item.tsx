import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { Pause, Play } from 'lucide-react'
import {
  usePlaybackState,
  useSpotifyPlayer,
} from 'react-spotify-web-playback-sdk'
import { HTMLAttributes, useCallback } from 'react'
import { AnimatedPlayIcon } from '@/components/compound-ui/animated-play-icon'
import { Box } from '@/components/ui/box'
import { Track } from '@spotify/web-api-ts-sdk'
import { cn } from '@/utils/class-names.utils'
import { sf_ms } from '@/utils/string.utils'

export type TrackItemProps = HTMLAttributes<HTMLDivElement> & {
  track: Track
  index: number
  isActive?: boolean
}

export const TrackItem = ({
  track,
  index,
  isActive = false,
  ...rest
}: TrackItemProps) => {
  const playbackState = usePlaybackState()
  const player = useSpotifyPlayer()

  const artistName = track.artists?.[0]?.name
  const imageUrl = track.album.images?.[1]?.url || defaultPlaylistIcon

  const renderPlayButtonOrIndex = useCallback(() => {
    const PlayPauseIcon = playbackState?.paused ? Play : Pause
    if (isActive)
      return (
        <button
          onClick={(e) => {
            e.stopPropagation()
            player?.togglePlay()
          }}
          className='rounded-full p-1 hover:bg-muted'
        >
          <PlayPauseIcon className='h-4 w-4' />
        </button>
      )

    return (
      <>
        <Play className='hidden h-4 w-4 text-muted-foreground animate-in zoom-in-[0.8] group-hover:block' />
        <p className='w-4 text-muted-foreground group-hover:hidden'>
          {index + 1}.
        </p>
      </>
    )
  }, [isActive, index, playbackState?.paused])

  return (
    <Box
      data-type='track-item'
      className={cn(
        'group mx-2 flex cursor-pointer items-center gap-4 rounded-sm px-4 py-2 hover:bg-foreground/5',
        {
          'border border-primary/20 bg-primary/10 hover:bg-primary/10':
            isActive,
        },
      )}
      {...rest}
    >
      {renderPlayButtonOrIndex()}
      <div className='flex flex-1 items-center justify-between gap-2'>
        <div className='flex flex-[3] gap-2'>
          <img src={imageUrl} className='h-8 w-8 rounded-[4px]' />
          <div className='flex flex-col'>
            <p className='flex items-center gap-1 text-sm font-medium'>
              {track.name}
              {isActive && (
                <AnimatedPlayIcon
                  className='ml-2'
                  paused={playbackState?.paused}
                  barProps={{
                    className: 'bg-primary',
                  }}
                />
              )}
            </p>
            <p className='max-w-[12rem] text-xs text-muted-foreground'>
              {artistName}
            </p>
          </div>
        </div>
        <div className='flex flex-[2] items-center justify-between gap-2'>
          <p className='text-xs text-muted-foreground'> {track.album.name}</p>
          <p className='text-xs text-muted-foreground'>
            {sf_ms(track.duration_ms)}
          </p>
        </div>
      </div>
    </Box>
  )
}
