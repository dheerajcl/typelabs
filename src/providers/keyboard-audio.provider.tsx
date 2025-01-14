import { DEFAULT_SOUNDPACK, SOUND_PACKS } from '@/config/keyboard.config'
import { AppStore } from '@/state/app-store'
import { Howl } from 'howler'
import { useEffect, useMemo, useState } from 'react'

const howls = Object.fromEntries(
  SOUND_PACKS.map((sound) => {
    const howl = new Howl({
      src: [sound.sound],
      sprite: sound.sprites,
    })
    return [sound.id, howl]
  }),
)

export const KeyboardAudioProvider = () => {
  const [interacted, setInteracted] = useState(false)
  const { soundPack } = AppStore.useStore('soundPack')

  const soundpack = useMemo(() => {
    const pack = SOUND_PACKS.find((sp) => sp.id == soundPack)
    if (pack) return pack

    AppStore.set({ soundPack: DEFAULT_SOUNDPACK.id })
    return DEFAULT_SOUNDPACK
  }, [soundPack])

  const handleKeyStroke = (e: KeyboardEvent) => {
    const { keyboardVolume: volume } = AppStore.store.getState()

    const howl = howls[soundpack.id]

    if (!interacted) setInteracted(true)
    let key = e.code
    // When pressed right after a letter, sometimes "Space" has a different keycode
    if (!key && e.key == ' ') key = 'Space'
    if (key in soundpack.sprites) {
      howl.volume(volume)
      howl.play(key)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyStroke)
    return () => document.removeEventListener('keydown', handleKeyStroke)
  }, [soundPack, interacted])

  return null
}
