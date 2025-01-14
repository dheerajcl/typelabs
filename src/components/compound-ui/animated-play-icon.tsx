import { cn } from '@/utils/class-names.utils'
import { FC, HTMLAttributes } from 'react'
import { For } from '../map'

type AnimatedPlayIconProps = HTMLAttributes<HTMLDivElement> & {
  paused?: boolean
  barProps?: HTMLAttributes<HTMLDivElement>
}

const bars = [
  'delay-100 h-3',
  'delay-300 h-2',
  'delay-200 h-4',
  'delay-100 h-2',
]

export const AnimatedPlayIcon: FC<AnimatedPlayIconProps> = ({
  paused,
  barProps = {},
  className,
  ...props
}) => {
  const { className: barCn, ...rest } = barProps
  return (
    <div className={cn('flex items-center gap-0.5', className)} {...props}>
      <For each={bars}>
        {(css, index) => (
          <div
            key={index}
            className={cn(
              'h-4 w-0.5 animate-playing rounded-full bg-foreground/20',
              css,
              paused && '!animate-none',
              barCn,
            )}
            {...rest}
          />
        )}
      </For>
    </div>
  )
}
