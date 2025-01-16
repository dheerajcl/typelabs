import { AppStore } from '@/state/app-store'
import { TimerStore } from '@/state/timer.store'
import { debounce } from '@/utils/helpers'

import { useEffect } from 'react'

const debouncedUpdateVolume = debounce(
  (vol: number) => window.spotifyClient?.player.setPlaybackVolume(vol),
  200,
)

const root = document.documentElement

export const StyleProvider = () => {
  const { setTotalTime } = TimerStore.useStore('setTotalTime')
  const {
    currentFont,
    previewedTheme,
    time,
    theme,
    musicVolume,
    borderRadius,
  } = AppStore.useStore(
    'currentFont',
    'time',
    'previewedTheme',
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
    setTotalTime(time)
  }, [time])

  return (
    <link rel='stylesheet' href={`/css/theme_${previewedTheme ?? theme}.css`} />
  )
}
