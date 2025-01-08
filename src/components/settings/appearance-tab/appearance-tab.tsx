import { ThemeSwitcher } from './theme-switcher'
import { BorderRadiusVisualizer } from '../soundpack-tab/border-radius-visualizer'
import {
  BORDER_RADII,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_THEME,
} from '@/config/appearance.config'
import { Setting } from '../setting'
import { AppStore } from '@/state/app-store'

export const AppearanceTab = () => {
  const { borderRadius } = AppStore.useStore('borderRadius')
  return (
    <div>
      <Setting
        title='Radius'
        description='Changes the base border radius of the website.'
        resetAction={() =>
          AppStore.set({ borderRadius: DEFAULT_BORDER_RADIUS })
        }
      >
        <div className='flex gap-4'>
          {BORDER_RADII.map((radius) => (
            <BorderRadiusVisualizer
              key={radius}
              radius={radius}
              isActive={radius === borderRadius}
              onClick={() => AppStore.set({ borderRadius: radius })}
            />
          ))}
        </div>
      </Setting>
      <Setting
        title='Themes'
        resetAction={() => AppStore.set({ theme: DEFAULT_THEME })}
      >
        <ThemeSwitcher />
      </Setting>
    </div>
  )
}
