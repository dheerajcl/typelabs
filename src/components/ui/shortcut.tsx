// import { UserAgent } from '@quentin-sommer/react-useragent'

import { cn } from '@/utils/class-names.utils'
import { HTMLAttributes } from 'react'

type ShortcutProps = HTMLAttributes<HTMLSpanElement> & {
  shortcut: string
}
export const Shortcut = ({ shortcut, className, ...rest }: ShortcutProps) => {
  return (
    <span
      className={cn(
        'grid min-h-4 min-w-6 place-items-center rounded-sm border border-muted-foreground/50 bg-background p-1 font-robotoMono text-xs shadow-sm backdrop-blur-sm',
        className,
      )}
      {...rest}
    >
      {shortcut}
    </span>
  )
}
