import { AppStore } from '@/state/app-store'
import { TimerStore } from '@/state/timer.store'
import { debounce } from '@/utils/helpers'
import {
  applySavedTheme,
  applyTheme,
  saveThemeToLocalStorage,
} from '@/utils/theme.utils'
import { useEffect } from 'react'

const debouncedUpdateVolume = debounce(
  (vol: number) => window.spotifyClient?.player.setPlaybackVolume(vol),
  200,
)

const root = document.documentElement

export const StyleProvider = () => {
  const { setTotalTime } = TimerStore.useStore('setTotalTime')
  const { currentFont, time, theme, musicVolume, borderRadius } =
    AppStore.useStore(
      'currentFont',
      'time',
      'theme',
      'musicVolume',
      'borderRadius',
    )

  useEffect(() => {
    root.attributeStyleMap.set('--radius', `${borderRadius}px`)
  }, [borderRadius])

  useEffect(() => {
    root.style.setProperty('--font-primary', currentFont)
  }, [currentFont])

  useEffect(() => {
    debouncedUpdateVolume(musicVolume)
  }, [musicVolume])

  useEffect(() => {
    applyTheme(theme)
    saveThemeToLocalStorage(theme)
  }, [theme])

  useEffect(() => {
    applySavedTheme()
  }, [])

  useEffect(() => {
    setTotalTime(time)
  }, [time])

  return null
}
