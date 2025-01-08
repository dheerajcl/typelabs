import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AudioLines, Bell, Volume1, Volume2, VolumeX } from 'lucide-react'
import {
  ChevronUpIcon,
  KeyboardIcon,
  SpeakerLoudIcon,
} from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { VolumeSlider } from '@/components/volume/volume-slider'
import { AppStore } from '@/state/app-store'

const ICONS = [VolumeX, Volume1, Volume2]

export const VolumeControls = () => {
  const { musicVolume, notificationsVolume, keyboardVolume } =
    AppStore.useStore('musicVolume', 'notificationsVolume', 'keyboardVolume')

  const getIndex = useCallback(() => {
    if (musicVolume == 0) return 0
    if (musicVolume > 0.5) return 2

    return 1
  }, [musicVolume])

  useEffect(() => {
    const Icon = ICONS[getIndex()]
    setIcon(<Icon className='h-5 w-5' />)
  }, [musicVolume])

  const [icon, setIcon] = useState(<SpeakerLoudIcon className='h-8 w-8' />)

  return (
    <DropdownMenu>
      <div className='flex items-end'>
        <VolumeSlider
          label={
            <>
              <AudioLines className='h-4 w-4' /> Volume
            </>
          }
          icon={icon}
          volume={musicVolume}
          onChange={(newVol) => AppStore.set({ musicVolume: newVol })}
        />
        <DropdownMenuTrigger asChild>
          <Button
            size='icon'
            variant='ghost'
            className='h-fit w-fit rounded-full p-3'
          >
            <ChevronUpIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <VolumeSlider
            label='Notifications'
            icon={<Bell className='h-4 w-4' />}
            volume={notificationsVolume}
            onChange={(newVol: number) =>
              AppStore.set({ notificationsVolume: newVol })
            }
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <VolumeSlider
            label='Keyboard'
            icon={<KeyboardIcon className='h-4 w-4' />}
            volume={keyboardVolume}
            onChange={(newVol: number) =>
              AppStore.set({ keyboardVolume: newVol })
            }
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <VolumeSlider
            label='Volume'
            icon={icon}
            volume={musicVolume}
            onChange={(newVol) => AppStore.set({ musicVolume: newVol })}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
