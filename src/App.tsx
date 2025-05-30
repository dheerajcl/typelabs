import { ListPlus, RotateCw } from 'lucide-react'
import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { Logo } from './assets/svgs/keyboard-icon'
import { KEYBINDS } from './config/keybinds.config'
import { useEngine } from './state/game-engine.store'
import { TimerStore } from './state/timer.store'
import { lazy } from './utils/helpers'
import { Box } from './components/ui/box'
import { GameActionButton } from './components/game-action-button'
import { TextArea } from './components/text-area'
import { Results } from './components/results'

const SettingsDialog = lazy(() =>
  import('@/components/settings/settings-dialog').then((m) => m.SettingsDialog),
)

const Footer = lazy(() => import('./footer').then((m) => m.Footer))

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
          {showResults ? <Results /> : <TextArea />}
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
      <Footer />
    </div>
  )
}

export default App
