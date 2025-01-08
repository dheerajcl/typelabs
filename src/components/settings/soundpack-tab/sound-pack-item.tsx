import { AppStore } from '@/state/app-store'
import { Check, X } from 'lucide-react'
import { cn } from '@/utils/class-names.utils'
import type { KeyboardSoundPackConfig } from '@/config/keyboard.config'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
  RadioCardProps,
} from '../../ui/radio-card'

export type SoundPackItemProps = Omit<RadioCardProps, 'isActive'> & {
  soundPack: KeyboardSoundPackConfig
  title: string
}
export const SoundPackItem = ({
  soundPack,
  title,
  ...props
}: SoundPackItemProps) => {
  const { soundPack: currentSoundPack } = AppStore.useStore('soundPack')

  return (
    <RadioCard
      onClick={() => AppStore.set({ soundPack })}
      isActive={soundPack.id === currentSoundPack.id}
      {...props}
    >
      <RadioCardDescription
        className={cn(
          'font-bold text-muted-foreground',
          soundPack.id === currentSoundPack.id && 'text-foregrond',
        )}
      >
        {title}
      </RadioCardDescription>
      <RadioCardContent>
        <p
          className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground',
            {
              'text-foreground': soundPack.id === currentSoundPack.id,
            },
          )}
        >
          Includes Numpad:
          {soundPack.includes_numpad ? (
            <Check className='h-4 w-4' />
          ) : (
            <X className='h-4 w-4' />
          )}
        </p>
      </RadioCardContent>
    </RadioCard>
  )
}
