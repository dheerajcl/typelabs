import { SpotifyPlayer } from './components/spotify-player'
import { UserInfo } from './components/spotify-user-info'
import { ThemeSwitcherList } from './components/theme-switcher-list'
import { Box } from './components/ui/box'
import { VolumeControls } from './components/volume/volume-control-popover'

export function Footer() {
  return (
    <Box gameResponsive className='flex w-full items-end gap-2 py-2'>
      <VolumeControls />
      <SpotifyPlayer />
      <div className='fixed bottom-0 right-0 flex flex-col items-end p-1'>
        <UserInfo />
        <ThemeSwitcherList />
      </div>
    </Box>
  )
}
