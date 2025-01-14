import { AppStore } from '@/state/app-store'
import { Timer } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

const tabClassNames =
  'rounded-full text-xs data-[state=active]:bg-muted-foreground data-[state=active]:text-background'

export const TimeSelector = () => {
  const { setTime, time } = AppStore.useStore('time', 'setTime')

  return (
    <div className='group m-auto flex h-9 w-fit items-center gap-2 rounded-full border border-foreground/10 bg-input pl-4 pr-2 shadow-sm'>
      <Timer className='h-4 w-4 text-muted-foreground' />
      <Tabs
        value={`${time}`}
        onValueChange={(newTime) => setTime(Number(newTime))}
      >
        <TabsList className='h-fit origin-left rounded-full bg-transparent'>
          <TabsTrigger className={tabClassNames} value='15'>
            15s
          </TabsTrigger>
          <TabsTrigger className={tabClassNames} value='30'>
            30s
          </TabsTrigger>
          <TabsTrigger className={tabClassNames} value='60'>
            60s
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
