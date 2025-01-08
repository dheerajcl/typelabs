import { DEFAULT_FONT } from '@/config/fonts.config'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSelector } from 'better-zustand-selector'
import { DEFAULT_SOUNDPACK } from '@/config/keyboard.config'
import {
  CaretStyle,
  CaretSmoothness,
  DEFAULT_CARET_SMOOTHNESS,
  DEFAULT_CARET_STYLE,
} from '@/config/caret.config'
import { TimerStore } from './timer.store'
import { debounce } from '@/utils/helpers'
import { spotifyClient } from '@/config/spotify-client.config'

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

  // Appearance
  theme: string
  borderRadius: number
  caretStyle: CaretStyle
  caretSmoothness: CaretSmoothness
}

const store = create(
  persist<State>(
    () => ({
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
    }),
    {
      name: 'app-storage',
      onRehydrateStorage(state) {
        TimerStore.store.setState({ totalTime: state.time })
        // if (window.spotifyClient.player) {
        //   window.spotifyClient.player.setPlaybackVolume(
        //     (state.musicVolume * 100) >> 0,
        //   )
        // }
      },
    },
  ),
)

const debouncedUpdateVolume = debounce(
  (vol: number) => spotifyClient.player.setPlaybackVolume(vol),
  200,
)
store.subscribe((state, prev) => {
  if (state.time != prev.time) {
    TimerStore.store.getState().setTotalTime(state.time)
  }
  if (state.musicVolume != prev.musicVolume) {
    debouncedUpdateVolume((state.musicVolume * 100) >> 0)
  }
})

export const AppStore = {
  useStore: createSelector(store),
  store,
  get: store.getState,
  set: store.setState,
}
