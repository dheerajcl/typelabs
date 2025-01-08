import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { AppStore } from '@/state/app-store'
import { useToast } from '@/components/ui/use-toast'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/utils/class-names.utils'
import { NotificationSFX, playNotificationSFX } from '@/hooks/use-sound-fx.hook'
import { generateFontCss } from '@/utils/string.utils'

export const MyFonts = () => {
  const { toast, dismiss } = useToast()
  const { userFonts, currentFont } = AppStore.useStore(
    'userFonts',
    'currentFont',
  )

  const handleRemoveFont = useCallback(
    (font: string) => {
      playNotificationSFX(NotificationSFX.Delete)

      const newUserFonts = userFonts.filter((f) => f !== font)
      AppStore.set({ userFonts: newUserFonts })

      toast({
        title: 'Font removed',
        description: `${font} was removed`,
        action: (
          <Button
            onClick={() => {
              AppStore.set({
                userFonts,
                currentFont,
              })
              dismiss()
            }}
          >
            Undo
          </Button>
        ),
      })
    },
    [userFonts, currentFont],
  )

  if (!userFonts.length) return <></>

  return (
    <>
      <DialogHeader>
        <DialogTitle>My Fonts</DialogTitle>
        <DialogDescription className='flex flex-wrap gap-2 pb-4 pt-2'>
          {userFonts.map((font, i) => (
            <Button
              key={i}
              variant='secondary'
              style={{
                fontFamily: generateFontCss(font),
              }}
              onClick={() => AppStore.set({ currentFont: font })}
              className={cn(
                'flex h-fit w-fit items-center justify-between gap-4 rounded-md px-2 py-1 text-foreground/80 outline outline-1 outline-foreground/20 hover:bg-foreground/20 hover:text-foreground hover:outline-foreground',
                font == currentFont &&
                  'bg-primary/20 text-foreground outline-1 outline-primary/50',
              )}
            >
              {font}
              <Button
                asChild
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFont(font)
                }}
                className='h-5 w-5 rounded-full p-[2px] text-xs hover:bg-background/40'
                size='icon'
                variant='ghost'
                tooltipContent='Remove Font'
              >
                <Cross2Icon />
              </Button>
            </Button>
          ))}
        </DialogDescription>
      </DialogHeader>
    </>
  )
}
