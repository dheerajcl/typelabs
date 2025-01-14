import { toast } from '@/components/ui/use-toast'
import {
  CaretSmoothness,
  CaretStyle,
  DEFAULT_CARET_SMOOTHNESS,
  DEFAULT_CARET_STYLE,
} from '@/config/caret.config'
import { DEFAULT_FONT } from '@/config/fonts.config'
import { DEFAULT_SOUNDPACK } from '@/config/keyboard.config'
import { createSelector } from 'better-zustand-selector'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TimerStore } from './timer.store'

type State = {
  // Font
  currentFont: string
  userFonts: string[]
  fontSize: number

  // Volume
  musicVolume: number
  keyboardVolume: number
  notificationsVolume: number

  // Keyboard Sound
  soundPack: string

  // Game Config
  time: number
  setTime: (newTime: State['time']) => void

  // Appearance
  theme: string
  borderRadius: number
  caretStyle: CaretStyle
  caretSmoothness: CaretSmoothness
}

const store = create(
  persist<State>(
    (set) => ({
      // Font
      currentFont: DEFAULT_FONT,
      userFonts: [],

      // Volume
      musicVolume: 1,
      keyboardVolume: 1,
      notificationsVolume: 1,

      // Keyboard Sound
      soundPack: DEFAULT_SOUNDPACK.id,

      // Game Config
      time: 30,

      // Appearance
      theme: 'carbon',
      fontSize: 24,
      caretStyle: DEFAULT_CARET_STYLE,
      caretSmoothness: DEFAULT_CARET_SMOOTHNESS,
      borderRadius: 12,

      setTime(time) {
        if (!TimerStore.get().isRunning) return set({ time })
        toast({
          description: "Can't change time when timer is running.",
        })
      },
    }),
    {
      name: 'app-settings',
    },
  ),
)

export const AppStore = {
  useStore: createSelector(store),
  store,
  get: store.getState,
  set: store.setState,
}
