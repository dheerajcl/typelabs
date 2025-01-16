import { cn } from '@/utils/class-names.utils'
import { formatThemeName } from '@/utils/theme.utils'
import { AppStore } from '@/state/app-store'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '@/components/ui/radio-card'
import { For } from '@/components/map'
import { useThemes } from '@/react-query/queries/lazy-modules.query'

export const ThemeSwitcher = () => {
  const { data: themes } = useThemes()
  const { theme } = AppStore.useStore('theme')

  return (
    <div className='grid w-full grid-cols-6 flex-wrap gap-4'>
      <For each={themes}>
        {({ mainColor, bgColor, textColor, name: themeName }) => {
          const displayColors = [mainColor, bgColor, textColor]
          const isActive = themeName === theme

          return (
            <RadioCard
              key={themeName}
              isActive={isActive}
              className={cn(
                'col-span-6 flex-grow md:col-span-3',
                isActive && 'shadow-md outline-primary/50',
              )}
              onClick={() => {
                AppStore.set({ theme: themeName })
              }}
            >
              <RadioCardDescription className='mb-1 flex items-center justify-between font-medium'>
                {formatThemeName(themeName)}
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
                  background: bgColor,
                }}
              ></RadioCardContent>
            </RadioCard>
          )
        }}
      </For>
    </div>
  )
}
