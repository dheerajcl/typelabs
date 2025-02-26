import { AppStore } from '@/state/app-store'
import { Setting } from '../setting'
import { SoundPackItem } from './sound-pack-item'
import { DEFAULT_SOUNDPACK, SOUND_PACKS } from '@/config/keyboard.config'
import { For } from '@/components/map'

export const SoundPackTab = () => {
  return (
    <Setting
      title='Choose Soundpack'
      description={
        <>
          Some <b>Soundpacks</b> don't offer the same functionality as the
          others.
        </>
      }
      resetAction={() => AppStore.set({ soundPack: DEFAULT_SOUNDPACK.id })}
    >
      <div className='grid grid-cols-2 gap-4'>
        <For each={SOUND_PACKS}>
          {(sound) => (
            <SoundPackItem
              key={sound.id}
              className='col-span-2 min-w-[12rem] md:col-span-1'
              soundPack={sound}
              title={sound.name}
            />
          )}
        </For>
      </div>
    </Setting>
  )
}
