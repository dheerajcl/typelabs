import { Button } from '../ui/button'
import { ReactNode } from 'react'
import { cn } from '@/utils/class-names.utils'

export const TabButton = (props: {
  icon?: ReactNode
  label: string
  tabIndex: number
  isActive: boolean
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
}) => {
  const activeClassName =
    props.isActive &&
    'hover:bg-initial bg-primary/20 text-foreground outline shadow-sm outline-1 outline-primary/50'

  return (
    <Button
      onClick={() => props.setCurrentTab(props.label)}
      variant='ghost'
      className={cn(
        'justify-normal gap-2 text-muted-foreground hover:bg-muted hover:text-accent-foreground',
        activeClassName,
      )}
    >
      {props.icon}
      {props.label}
    </Button>
  )
}
