import { AppStore } from '@/state/app-store'
import { Setting } from '../setting'
import { RadioCard, RadioCardContent } from '@/components/ui/radio-card'
import {
  DEFAULT_CARET_SMOOTHNESS,
  DEFAULT_CARET_STYLE,
  CaretSmoothness,
  CaretStyle,
} from '@/config/caret.config'
import { For } from '@/components/map'

export const CaretTab = () => {
  const { caretStyle, caretSmoothness } = AppStore.useStore(
    'caretStyle',
    'caretSmoothness',
  )
  return (
    <div>
      <Setting
        title='Caret Style'
        resetAction={() => AppStore.set({ caretStyle: DEFAULT_CARET_STYLE })}
      >
        <div className='flex items-end gap-4'>
          <For each={Object.values(CaretStyle)}>
            {(style) => {
              return (
                <RadioCard
                  isActive={caretStyle === style}
                  key={style}
                  onClick={() => AppStore.set({ caretStyle: style })}
                  className='flex aspect-square h-9 w-7 items-center justify-center'
                  tooltipContent={style}
                >
                  <RadioCardContent>
                    <CaretStyleVisualizer variant={style} />
                  </RadioCardContent>
                </RadioCard>
              )
            }}
          </For>
        </div>
      </Setting>
      <Setting
        title='Caret Smoothness'
        resetAction={() =>
          AppStore.set({ caretSmoothness: DEFAULT_CARET_SMOOTHNESS })
        }
      >
        <div className='flex gap-4'>
          <For each={Object.values(CaretSmoothness)}>
            {(key) => {
              return (
                <RadioCard
                  isActive={caretSmoothness === key}
                  key={key}
                  onClick={() => AppStore.set({ caretSmoothness: key })}
                >
                  <RadioCardContent>{key}</RadioCardContent>
                </RadioCard>
              )
            }}
          </For>
        </div>
      </Setting>
    </div>
  )
}

const caretStyleVariants = {
  [CaretStyle.Line]: 'w-0.5 h-4 bg-caret',
  [CaretStyle.Underline]: 'w-3 h-0.5 bg-caret',
  [CaretStyle.Block]: 'w-3 h-4 bg-caret',
  [CaretStyle.Box]: 'w-3 h-4 border border-caret',
}

const CaretStyleVisualizer = (props: { variant: CaretStyle }) => (
  <div className={caretStyleVariants[props.variant]} />
)
