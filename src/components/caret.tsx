import { cn } from '@/utils/class-names.utils'
import { useMemo } from 'react'
import { useEngine } from '@/state/game-engine.store'
import { AppStore } from '@/state/app-store'
import { caretSmoothnessValues, CaretStyle } from '@/config/caret.config'
import { TimerStore } from '@/state/timer.store'

export const Caret = (props: { className?: string }) => {
  const { fontSize, caretStyle, caretSmoothness } = AppStore.useStore(
    'fontSize',
    'caretStyle',
    'caretSmoothness',
  )
  const { caretPosition: pos } = useEngine('caretPosition')
  const { isRunning, isPaused } = TimerStore.useStore('isRunning', 'isPaused')

  const currentCaretStyle = useMemo(
    () =>
      ({
        [CaretStyle.Line]: {
          width: 2,
        },
        [CaretStyle.Block]: {
          width: fontSize / 1.6,
        },
        [CaretStyle.Box]: {
          width: fontSize / 1.6,
          border: '1px solid hsl(var(--caret-color))',
          backgroundColor: 'transparent !important',
        },
        [CaretStyle.Underline]: {
          width: fontSize / 1.6,
          height: 2,
        },
      })[caretStyle],
    [caretStyle, fontSize],
  )
  return (
    <div
      style={{
        top: pos.y - fontSize * 0.3,
        left: pos.x,
        transition: `${caretSmoothnessValues[caretSmoothness]}s linear`,
        height: fontSize + fontSize * 0.3,
        ...currentCaretStyle,
      }}
      className={cn(
        'absolute -z-10 -translate-y-full shadow-md',
        caretStyle !== CaretStyle.Box && 'bg-caret',
        caretStyle === CaretStyle.Underline && 'translate-y-full',
        (isPaused || !isRunning) && 'animate-blink',
        props.className,
      )}
    />
  )
}
