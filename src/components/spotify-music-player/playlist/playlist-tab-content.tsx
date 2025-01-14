import defaultPlaylistIcon from '@/assets/images/default-playlist.png'
import { TrackItemCollection } from '@/components/spotify-music-player/track/track-item-collection'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/utils/class-names.utils'
import { AvatarImage } from '@radix-ui/react-avatar'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AlertTriangle, Play, Shuffle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  usePlaybackState,
  usePlayerDevice,
} from 'react-spotify-web-playback-sdk'
import { PlaylistTabContentSkeleton } from './playlist-tab-content.skeleton'
import { User } from '@spotify/web-api-ts-sdk'
import { usePlaylist } from '@/react-query/queries/spotify.query'
import { failable } from '@/utils/errors.utils'

type PlaylistTabContentProps = {
  activePlaylist: string
}

function useSpotifyUser(
  userId: string | undefined,
  options?: UseQueryOptions<User | undefined>,
) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) return
      return window.spotifyClient.users.profile(userId)
    },
    ...options,
  })
}

export const PlaylistTabContent = ({
  activePlaylist,
}: PlaylistTabContentProps) => {
  const device = usePlayerDevice()
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const { data: playlist, error, isLoading } = usePlaylist(activePlaylist)
  const { data: owner, refetch } = useSpotifyUser(playlist?.owner.id)

  useEffect(() => {
    if (playlist) refetch()
  }, [playlist])

  function handleTracksScroll(newIdx: number) {
    setHasReachedScrollThreshold(newIdx > 3)
  }

  function handlePlaylistPlay() {
    if (!device?.device_id || !playlist) return
    window.spotifyClient.player.startResumePlayback(
      device.device_id,
      playlist.uri,
    )
  }

  const [hasReachedScrollThreshold, setHasReachedScrollThreshold] =
    useState(false)

  if (isLoading && activePlaylist) return <PlaylistTabContentSkeleton />

  if (error) {
    return (
      <div className='flex w-full items-center justify-center gap-4 text-lg'>
        <AlertTriangle className='h-10 w-10 text-rose-500' />
        <h2>
          Error loading the playlist.
          <br /> Try refreshing the page or try again later.
        </h2>
      </div>
    )
  }

  const playlistCoverUrl = playlist?.images?.[0].url || defaultPlaylistIcon

  return (
    <div className='sm:min-w-auto relative flex h-full w-full flex-col gap-4 animate-in'>
      <img
        src={playlistCoverUrl}
        className='absolute -z-20 h-1/2 blur-[140px]'
      />
      <header className='relative flex w-full min-w-[22rem] items-end gap-3 bg-cover bg-center px-4 py-2'>
        <img
          src={playlistCoverUrl}
          alt={playlist?.name}
          className={cn(
            'z-10 aspect-square h-24 shadow-xl transition-all md:h-[10rem] lg:h-[12rem]',
            hasReachedScrollThreshold && 'h-14 md:h-14 lg:h-14',
          )}
        />

        <div>
          <div
            className={cn(
              'mb-1 flex flex-col gap-1 transition-all',
              hasReachedScrollThreshold && 'gap-0',
            )}
          >
            <p
              className={cn(
                'text-sm text-muted-foreground transition-all',
                hasReachedScrollThreshold && 'text-xs md:text-xs lg:text-xs',
              )}
            >
              Playlist
            </p>
            <h2
              className={cn(
                'text-xl font-bold transition-all md:text-3xl lg:text-4xl',
                hasReachedScrollThreshold && 'text-md md:text-lg lg:text-lg',
              )}
            >
              {playlist?.name}
            </h2>
            <p
              ref={descriptionRef}
              className={cn(
                'group my-1 line-clamp-2 text-xs text-muted-foreground transition-all animate-in slide-in-from-left-10 lg:line-clamp-3 xl:line-clamp-none',
                hasReachedScrollThreshold &&
                  'hidden md:hidden lg:hidden xl:hidden',
              )}
            >
              {playlist?.description}
            </p>
          </div>
          <p
            className={cn(
              'flex items-center gap-1 text-sm text-muted-foreground animate-in slide-in-from-left-10',
              hasReachedScrollThreshold && 'text-xs md:text-xs lg:text-xs',
            )}
          >
            <Avatar
              className={cn('h-6 w-6', hasReachedScrollThreshold && 'h-4 w-4')}
            >
              <AvatarImage
                className='object-cover'
                src={owner?.images?.[0]?.url}
              />
              <AvatarFallback>
                {playlist?.owner.display_name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            {playlist?.owner?.display_name} • {playlist?.tracks?.total} tracks
          </p>
        </div>
      </header>
      <div className='flex w-full items-end gap-4 px-4'>
        <Button
          onClick={handlePlaylistPlay}
          size='icon'
          className='gap-2 rounded-full bg-primary font-semibold'
          tooltipContent='Play Playlist'
        >
          <Play className='h-4 w-4 fill-black stroke-primary-foreground stroke-[1]' />
        </Button>
        <ShuffleToggle />
      </div>
      {!!playlist && (
        <TrackItemCollection
          onScrolled={handleTracksScroll}
          playlist={playlist!}
        />
      )}
    </div>
  )
}

const ShuffleToggle = () => {
  const pbState = usePlaybackState()
  const { device_id } = usePlayerDevice() || {}
  const [shuffle, setShuffle] = useState(!pbState?.shuffle)

  async function changeShuffle(newShuffle: boolean) {
    setShuffle(newShuffle)
    const [err] = await failable.async(() =>
      window.spotifyClient.player.togglePlaybackShuffle(newShuffle, device_id),
    )

    if (err != null) {
      console.error(err)
      setShuffle(shuffle)
    }
  }

  useEffect(() => {
    if (!pbState) return
    setShuffle(pbState.shuffle)
  }, [!pbState?.shuffle])

  return (
    <Toggle
      pressed={shuffle}
      onPressedChange={changeShuffle}
      size='sm'
      className='hover:text-initial h-fit w-fit items-start gap-2 rounded-full py-1 text-xs outline outline-1 outline-foreground/20 backdrop-blur-sm hover:bg-foreground/5 data-[state=on]:bg-primary/30 data-[state=on]:!text-foreground data-[state=on]:outline data-[state=on]:outline-primary/50'
    >
      <Shuffle className='size-4' />
      <span className='-mt-[1.4px]'>Shuffle</span>
    </Toggle>
  )
}
