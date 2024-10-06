import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AudioLines, Bell, Volume1, Volume2, VolumeX } from 'lucide-react'
import {
  ChevronUpIcon,
  KeyboardIcon,
  SpeakerLoudIcon,
} from '@radix-ui/react-icons'
import {
  keyboardVolumeAtom,
  uiVolumeAtom,
  useUiVolume,
  notificationsVolumeAtom,
} from '@/state/atoms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { VolumeSlider } from '@/components/volume/volume-slider'
import { useSpotifyPlayer } from 'react-spotify-web-playback-sdk'

const ICONS = [VolumeX, Volume1, Volume2]

export const VolumeControls = () => {
  const [volume] = useUiVolume()
  const player = useSpotifyPlayer()

  const getIndex = useCallback(() => {
    if (volume == 0) return 0
    if (volume > 0.5) return 2

    return 1
  }, [volume])

  useEffect(() => {
    player?.setVolume(volume / 2)
  }, [volume])

  useEffect(() => {
    const Icon = ICONS[getIndex()]
    setIcon(<Icon className='h-5 w-5' />)
  }, [volume])

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
          atom={uiVolumeAtom}
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
            atom={notificationsVolumeAtom}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <VolumeSlider
            label='Keyboard'
            icon={<KeyboardIcon className='h-4 w-4' />}
            atom={keyboardVolumeAtom}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <VolumeSlider label='Volume' icon={icon} atom={uiVolumeAtom} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
