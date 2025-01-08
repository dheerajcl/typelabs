import { egOreo } from '@/assets/sfx/keyboard-soundpacks/eg-oreo/config'
import { nkCream } from '@/assets/sfx/keyboard-soundpacks/nk-cream/config'

export type KeyboardSoundPackConfig = {
  id: string
  name: string
  key_define_type: 'key' | 'code'
  includes_numpad: boolean
  sound: string
  sprites: Record<string, [number, number]>
}

export const SOUND_PACKS = [egOreo, nkCream]
export const DEFAULT_SOUNDPACK = SOUND_PACKS[0]
