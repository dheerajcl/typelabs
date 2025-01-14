import { AppStore } from '@/state/app-store'
import { Howl } from 'howler'
import uiSounds from '@/assets/sfx/ui-sounds.wav'

export enum NotificationSFX {
  Error = 'error',
  Success = 'success',
  Neutral = 'neutral',
  Click = 'click',
  Delete = 'delete',
}

const howl = new Howl({
  src: uiSounds,
  sprite: {
    [NotificationSFX.Click]: [0, 1000],
    [NotificationSFX.Delete]: [1000, 430],
    [NotificationSFX.Error]: [1430, 1000],
    [NotificationSFX.Neutral]: [2430, 1593],
    [NotificationSFX.Success]: [4023, 1000],
  },
})

export function playNotificationSFX(
  soundName: NotificationSFX,
  volume?: number,
) {
  howl.volume(volume || AppStore.store.getState().notificationsVolume)
  howl.play(soundName)
}
