import { MouseEventHandler, ReactNode, WheelEvent, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '../ui/slider'

type VolumeSliderProps = {
  icon: ReactNode
  volume: number
  onChange: (newVol: number) => void
  onChangeCommit?: (newVol: number) => void
  label?: ReactNode
}
export const VolumeSlider = ({
  icon,
  volume,
  onChange,
  onChangeCommit,
  label,
}: VolumeSliderProps) => {
  const [lastVolume, setLastVolume] = useState(0)

  const updateVolume = (change: number) => {
    let newVol = volume + change
    if (newVol >= 1) newVol = 1
    if (newVol <= 0) newVol = 0
    onChange(newVol)
  }

  const updateVolumeOnWheelEvent = (e: WheelEvent<HTMLDivElement>) => {
    const dY = e.deltaY
    const dX = dY > 0 ? -0.1 : 0.1
    updateVolume(dX)
  }

  const handleChange = (value: number[]) => {
    onChange(value[0])
  }

  const toggleMute: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    if (volume == 0) {
      if (lastVolume == 0) return onChange(0.5)
      return onChange(lastVolume)
    }

    setLastVolume(volume)
    onChange(0)
  }
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className='group relative flex w-fit flex-col items-start rounded-md pr-2'
    >
      {!!label && (
        <p className='flex select-none items-center gap-1 px-2 pt-2 text-xs text-muted-foreground'>
          {label}
        </p>
      )}
      <div className='flex items-center gap-2'>
        <Button
          onClick={toggleMute}
          variant='ghost'
          className='rounded-md p-2 hover:bg-background/20'
          size='icon'
          tooltipContent={volume == 0 ? 'Unmute' : 'Mute'}
        >
          {icon}
        </Button>

        <Slider
          tooltipContent={(volume * 100) >> 0}
          onWheelCapture={updateVolumeOnWheelEvent}
          className='w-24 cursor-pointer py-4'
          trackClassName='bg-background h-1 transition-all'
          thumbClassName='scale-0 transition-all h-4 w-4 group-hover:scale-100 origin-left'
          onValueChange={handleChange}
          onValueCommit={(newVol) => onChangeCommit?.(newVol[0])}
          max={1}
          value={[volume]}
          defaultValue={[0]}
          step={0.01}
        />
      </div>
    </div>
  )
}
