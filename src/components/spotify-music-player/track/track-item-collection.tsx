import { ScrollAreaRoot, ScrollAreaViewport } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useTrackListQuery } from '@/react-query/queries/spotify.query'
import { Playlist, Track } from '@spotify/web-api-ts-sdk'
import { Clock } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  usePlaybackState,
  usePlayerDevice,
} from 'react-spotify-web-playback-sdk'
import { Virtuoso } from 'react-virtuoso'
import { TrackItem } from './track-item'

type TrackItemCollectionProps = {
  playlist: Playlist<Track>
  onScrolled: (startIndex: number) => void
}

export const TrackItemCollection = ({
  playlist,
  onScrolled,
}: TrackItemCollectionProps) => {
  const device = usePlayerDevice()
  const playbackState = usePlaybackState()

  const [scrollParent, setScrollParent] = useState<HTMLDivElement | null>(null)

  const {
    data: tracksQueryData,
    fetchNextPage,
    refetch: refetchTracks,
    isFetchingNextPage,
  } = useTrackListQuery(playlist.id, playlist.tracks.items)

  const tracksList = useMemo(
    () =>
      tracksQueryData?.pages
        .flatMap((page) => page.items)
        .flatMap((item) => item),
    [tracksQueryData],
  )

  useEffect(() => {
    refetchTracks()
  }, [playlist.id])

  const handlePlayTrack = async (trackUri: string) => {
    if (!device || !playbackState?.context.uri) return

    spotifyClient.player.startResumePlayback(
      device.device_id,
      playlist.uri,
      undefined,
      {
        uri: trackUri,
      },
    )
  }

  return (
    <div className='flex h-full w-full flex-col gap-1 pb-10'>
      <div className='flex items-center justify-between gap-2 px-4 pb-2'>
        <div className='flex flex-[3] gap-5'>
          <p className='text-xs text-muted-foreground'>#</p>
          <p className='text-xs text-muted-foreground'>Title</p>
        </div>
        <div className='flex flex-[2] justify-between gap-4'>
          <p className='px-1 text-xs text-muted-foreground'>Album</p>
          <Clock className='mr-6 h-4 w-4 text-muted-foreground' />
        </div>
      </div>

      <ScrollAreaRoot className='no-scrollbar h-full overflow-y-auto pr-4'>
        <ScrollAreaViewport className='no-scrollbar' ref={setScrollParent}>
          <Virtuoso
            rangeChanged={({ startIndex }) => onScrolled(startIndex)}
            data={tracksList}
            className='!h-0'
            customScrollParent={scrollParent ?? undefined}
            endReached={() => {
              if (tracksList?.length === playlist.tracks.total) return
              fetchNextPage()
            }}
            itemContent={(i, track) => {
              const isActive =
                track.track.id === playbackState?.track_window.current_track.id
              return (
                <TrackItem
                  onClick={() => handlePlayTrack(track.track.uri)}
                  isActive={isActive}
                  index={i}
                  track={track.track}
                />
              )
            }}
            components={{
              Footer: () => isFetchingNextPage && <LoadingNewTracks />,
            }}
          />
        </ScrollAreaViewport>
      </ScrollAreaRoot>
    </div>
  )
}

const LoadingNewTracks = () => (
  <div className='my-2 ml-4 flex items-center gap-1'>
    <Skeleton className='h-4 w-7 rounded-sm bg-sub' />
    <Skeleton className='flex h-9 w-9 items-center gap-2 bg-sub px-2' />
    <div>
      <Skeleton className='mb-1 h-4 w-20 rounded-sm bg-sub' />
      <Skeleton className='h-3 w-[10rem] rounded-sm bg-sub' />
    </div>
  </div>
)
