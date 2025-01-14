import { cn } from '@/utils/class-names.utils'
import { useEffect, useRef, useState } from 'react'
import { ThickArrowUpIcon } from '@radix-ui/react-icons'
import { Focus } from 'lucide-react'
import { useEngine } from '@/state/game-engine.store'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Caret } from './caret'
import { TimeSelector } from './test-time-selector'
import { AppStore } from '@/state/app-store'
import { TimerStore } from '@/state/timer.store'
import { For } from './map'

export const TextArea = () => {
  const { isPaused, isRunning } = TimerStore.useStore('isPaused', 'isRunning')
  const {
    textAreaFocus: focus,
    textString,
    userInput,
    appendText,
  } = useEngine(
    'textAreaFocus',
    'textString',
    'userInput',
    'appendText',
    'caretPosition',
  )

  const [capslockRef] = useAutoAnimate()
  const [isCaps, setIsCaps] = useState(false)

  const textAreaRef = useRef<HTMLDivElement>(null)
  const { fontSize } = AppStore.useStore('fontSize')
  const lineHeight = fontSize * 1.6

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const caps = e.getModifierState('Capslock')
      setIsCaps(caps)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    const letter = document.getElementById(`letter-${userInput.length}`)
    letter?.scrollIntoView({ block: 'center' })
    if (textString.length - userInput.length <= 75) appendText()
  }, [userInput])

  return (
    <div>
      <TimeSelector />
      <div
        className={cn(
          `absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-lg text-foreground/90 opacity-0 drop-shadow-md transition-all`,
          !focus && 'opacity-100',
        )}
      >
        <Focus className='h-5 w-5' /> Click to return to focus.
      </div>
      <div
        className={cn(
          'relative z-10 mx-auto flex max-h-[25rem] w-full flex-1 flex-col md:max-w-[1200px]',
          !isPaused && isRunning && 'cursor-none',
        )}
      >
        <div className='flex w-full justify-between'>
          <TimeText />
          {!isCaps && (
            <h3
              ref={capslockRef}
              className='flex items-center gap-1 whitespace-nowrap rounded-md border-2 bg-background px-2 py-1 text-sm animate-out zoom-out-75'
            >
              <ThickArrowUpIcon className='h-4 w-4 text-muted-foreground' />
              Capslock on
            </h3>
          )}
        </div>
        <div
          style={{ maxHeight: 3 * lineHeight }}
          className={cn(
            'relative z-0 my-4 h-fit select-none overflow-hidden text-sub transition-[filter] duration-200',
            !focus && 'blur-sm',
          )}
        >
          <div>
            <div
              ref={textAreaRef}
              className='relative -z-10'
              style={{
                fontSize: fontSize,
                lineHeight: lineHeight + 'px',
              }}
            >
              <Caret />
              <For each={textString.split('')}>
                {(char, i) => {
                  const id = `letter-${i}`
                  const input = userInput[i]

                  const correct = input === char

                  const textError = input !== char && !!input
                  const spaceError = char === ' ' && char !== input && !!input

                  const isSpace = char == ' '
                  return (
                    <span
                      key={i}
                      id={id}
                      className={cn('z-10', {
                        /* INFO (For future reference)
                         * When a space character is at the end of a line, the span element has no width
                         * since spaces don't take up physical space at line endings. This causes issues
                         * with the typing scroll behavior since we need each character's position for
                         * proper scrolling.
                         *
                         * Adding a tiny 0.1px right border gives the span element a small width,
                         * even at line endings. This ensures smooth scrolling behavior when typing spaces
                         * at the end of lines.
                         */
                        'border-r-[0.1px] border-transparent': isSpace,
                        'text-error': textError,
                        'bg-error/50': spaceError,
                        'text-foreground': correct,
                      })}
                    >
                      {char}
                    </span>
                  )
                }}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TimeText = () => {
  const { timeInt } = TimerStore.useStore('timeInt')
  return <p className='text-2xl text-primary'>{timeInt}</p>
}
