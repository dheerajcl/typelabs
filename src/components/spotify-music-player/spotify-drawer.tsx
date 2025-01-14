import { useMyPlaylists } from '@/react-query/queries/spotify.query'
import { ListMusic } from 'lucide-react'
import { useState } from 'react'
import { MusicPlayer } from './music-player'
import { PlaylistTab } from './playlist/playlist-tab'
import { PlaylistTabContent } from './playlist/playlist-tab-content'
import { PlaylistTabContentSkeleton } from './playlist/playlist-tab-content.skeleton'
import { DrawerSkeleton } from './spotify-drawer.skeleton'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePlaybackState } from 'react-spotify-web-playback-sdk'
import 'helvatica-neue-lt/index.css'
import { For } from '../map'

export const SpotifyDrawer = () => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  return (
    <Drawer>
      <DrawerTrigger className='font-robotoMono' asChild>
        <div className='w-full cursor-pointer'>
          <MusicPlayer />
        </div>
      </DrawerTrigger>
      <DrawerContent className='h-[80%] overflow-hidden font-player focus:outline-none'>
        <Content
          selectedPlaylistId={selectedPlaylistId}
          setSelectedPlaylistId={setSelectedPlaylistId}
        />
      </DrawerContent>
    </Drawer>
  )
}

type ContentProps = {
  selectedPlaylistId: string
  setSelectedPlaylistId: (id: string) => void
}
function Content(props: ContentProps) {
  const { data: playlists, isLoading, error: playlistError } = useMyPlaylists()

  const pbState = usePlaybackState()

  if (playlistError) {
    return (
      <div className='flex h-[80%] w-full flex-col items-center justify-center'>
        There was an error fetching your playlists.
        <br />
        Please try again later.
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col justify-between'>
      <div className='mx-auto mt-4 flex w-[calc(100vw-2rem)] max-w-[1200px] flex-1 gap-2 lg:w-[80%]'>
        {isLoading && (
          <>
            <DrawerSkeleton />
            <PlaylistTabContentSkeleton />
          </>
        )}
        {!isLoading && (
          <>
            <div className='relative flex flex-col'>
              <DrawerHeader className='py-0 pb-4 pl-1 transition-all md:pl-4'>
                <DrawerTitle className='text-left text-sm font-bold transition-all md:text-xl md:font-bold'>
                  Playlists
                </DrawerTitle>
              </DrawerHeader>

              <ScrollArea className='h-full overflow-y-auto'>
                <div className='flex h-[12rem] flex-col gap-2 pr-4'>
                  <For each={playlists?.items}>
                    {(playlist) => {
                      return (
                        <PlaylistTab
                          onClick={() =>
                            props.setSelectedPlaylistId(playlist.id)
                          }
                          key={playlist.id}
                          playlist={playlist}
                          isBeingPlayed={pbState?.context.uri === playlist.uri}
                          isActive={props.selectedPlaylistId == playlist.id}
                        />
                      )
                    }}
                  </For>
                </div>
              </ScrollArea>
            </div>
            {!!props.selectedPlaylistId && (
              <PlaylistTabContent activePlaylist={props.selectedPlaylistId} />
            )}
            {!props.selectedPlaylistId && (
              <h2 className='m-auto flex items-center gap-2 text-xl font-bold'>
                <ListMusic className='h-10 w-10' />
                No playlist selected
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  )
}
