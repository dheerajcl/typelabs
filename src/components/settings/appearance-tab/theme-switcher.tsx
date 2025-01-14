import { cn } from '@/utils/class-names.utils'
import { formatThemeName } from '@/utils/theme.utils'
import colors from '@/styles/theme-list.json'
import { AppStore } from '@/state/app-store'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '@/components/ui/radio-card'
import { For } from '@/components/map'

export const ThemeSwitcher = () => {
  const { theme } = AppStore.useStore('theme')

  return (
    <div className='grid w-full grid-cols-6 flex-wrap gap-4'>
      <For each={colors}>
        {(color) => {
          const primary = color.mainColor
          const bg = color.bgColor
          const text = color.textColor
          const displayColors = [primary, bg, text]
          const isActive = color.name === theme

          return (
            <RadioCard
              key={color.name}
              isActive={isActive}
              className={cn(
                'col-span-6 flex-grow md:col-span-3',
                isActive && 'shadow-md outline-primary/50',
              )}
              onClick={() => {
                AppStore.set({ theme: color.name })
              }}
            >
              <RadioCardDescription className='mb-1 flex items-center justify-between font-medium'>
                {formatThemeName(color.name)}
                <div className='flex gap-1'>
                  <For each={displayColors}>
                    {(col, i) => (
                      <div
                        key={i}
                        style={{
                          background: col,
                        }}
                        className='h-4 w-4 rounded-full border border-foreground'
                      />
                    )}
                  </For>
                </div>
              </RadioCardDescription>
              <RadioCardContent
                className='flex flex-col gap-2'
                style={{
                  background: bg,
                }}
              ></RadioCardContent>
            </RadioCard>
          )
        }}
      </For>
    </div>
  )
}
