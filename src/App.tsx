import { ListPlus, RotateCw } from 'lucide-react'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Logo } from './assets/svgs/keyboard-icon'
import { GameActionButton } from './components/game-action-button'
import { NoSpotifyPremiumButton } from './components/no-spotify-premium-button'
import { Results } from './components/results'
import { SettingsDialog } from './components/settings/settings-dialog'
import { ConnectSpotifyButton } from './components/spotify-music-player/connect-spotify-button'
import { SpotifyDrawer } from './components/spotify-music-player/spotify-drawer'
import { UserInfo } from './components/spotify-user-info'
import { TextArea } from './components/text-area'
import { ThemeSwitcherList } from './components/theme-switcher-list'
import { Box } from './components/ui/box'
import { VolumeControls } from './components/volume/volume-control-popover'
import { KEYBINDS } from './config/keybinds.config'
import { useEngine } from './state/game-engine.store'
import { TimerStore } from './state/timer.store'
import { useUserQuery } from './react-query/queries/spotify.query'

function App() {
  const { hasTimerEnded, pauseTimer } = TimerStore.useStore(
    'hasTimerEnded',
    'pauseTimer',
  )
  const showResults = !!hasTimerEnded

  const {
    setTextAreaFocus: setFocus,
    generateText,
    restart,
  } = useEngine('generateText', 'setTextAreaFocus', 'restart')

  useEffect(() => {
    addEventListener('mousemove', pauseTimer)
    return () => removeEventListener('mousemove', pauseTimer)
  }, [])

  useHotkeys(KEYBINDS.NEW_GAME.hotkey, generateText)
  useHotkeys(KEYBINDS.RESTART.hotkey, restart)

  const CurrentView = showResults ? Results : TextArea

  return (
    <div className='mx-auto flex h-screen w-[calc(100%-64px)] max-w-[1200px] flex-col md:w-[80%]'>
      <div className='flex w-full items-center py-4'>
        <h1 className='flex select-none items-center gap-2 font-poppins text-3xl text-foreground'>
          <Logo className='-mb-1 h-12 w-12 stroke-main' />
          typelabs
        </h1>
        <Box gameResponsive>
          <SettingsDialog />
        </Box>
      </div>

      <Box
        onClickOutside={() => setFocus(false)}
        onMouseLeave={() => pauseTimer()}
        onClick={() => setFocus(true)}
        className='duration-400 relative flex flex-1 flex-col justify-center transition-all animate-in fade-in-0 slide-in-from-bottom-10 focus:outline-none'
      >
        <div className='max-w-full'>
          <CurrentView />
        </div>
        <div className='flex justify-center gap-2 text-sm'>
          <GameActionButton
            label='Restart'
            icon={<RotateCw className='h-4 w-4' />}
            shortcut={KEYBINDS.RESTART.label}
            onClick={(e) => {
              e.currentTarget.blur()
              restart()
            }}
          />
          <GameActionButton
            label='New'
            icon={<ListPlus className='h-4 w-4' />}
            shortcut={KEYBINDS.NEW_GAME.label}
            onClick={(e) => {
              e.currentTarget.blur()
              generateText()
            }}
          />
        </div>
      </Box>
      <Box gameResponsive className='flex w-full items-end gap-2 py-2'>
        <VolumeControls />
        <SpotifyPlayer />
        <div className='fixed bottom-0 right-0 flex flex-col items-end p-1'>
          <UserInfo />
          <ThemeSwitcherList />
        </div>
      </Box>
    </div>
  )
}

export default App

const SpotifyPlayer = () => {
  const { data: user } = useUserQuery()

  if (!user) return <ConnectSpotifyButton />

  const product = user?.['product' as keyof typeof user]
  if (product !== 'premium') return <NoSpotifyPremiumButton />

  return <SpotifyDrawer />
}
