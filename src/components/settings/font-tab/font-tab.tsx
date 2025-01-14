import { DEFAULT_FONT, DEFAULT_FONT_SIZE, FONTS } from '@/config/fonts.config'
import { Dispatch, HTMLAttributes, SetStateAction, useState } from 'react'
import { AppStore } from '@/state/app-store'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '@/components/ui/radio-card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { AddFontModal } from './add-font-modal'
import { Dialog } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { FontSizeIcon } from '@radix-ui/react-icons'
import { Setting } from '../setting'
import { generateFontCss } from '@/utils/string.utils'
import { For } from '@/components/map'

export const FontSelect = () => {
  const { fontSize, userFonts } = AppStore.useStore('userFonts', 'fontSize')
  const [value, setValue] = useState(
    'The Quick Brown fox jumps over the lazy dog.',
  )
  const fontSizeSliderValue = (fontSize / 24) * 100 - 50
  const handleFontSizeChange = (value: [number]) => {
    const updatedPercentage = value[0] + 50
    const updatedFontSize = (24 * updatedPercentage) / 100
    AppStore.set({ fontSize: updatedFontSize })
  }
  return (
    <Dialog>
      <Setting
        title='Text Size'
        description='The text size is the size of the text in the game. The default size is 24px.'
        resetAction={() => AppStore.set({ fontSize: DEFAULT_FONT_SIZE })}
      >
        <div className='flex gap-2'>
          <div className='flex items-center gap-2'>
            <FontSizeIcon className='text-muted-foreground' />
            <p className='min-w-[1.5rem] font-bold'>{fontSize >> 0}</p>
          </div>
          <Slider
            step={10}
            value={[fontSizeSliderValue]}
            onValueChange={handleFontSizeChange}
          />
        </div>
      </Setting>
      <Setting
        title='Fonts'
        resetAction={() => AppStore.set({ currentFont: DEFAULT_FONT })}
      >
        <Label className='pl-1'>Preview Text</Label>
        <Input
          className='mb-8 resize-none border border-border bg-muted'
          placeholder='Type here to preview'
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Setting subtitle='Preinstalled Fonts'>
          <div className='grid max-h-full grid-cols-2 gap-4'>
            <For each={FONTS}>
              {(font, i) => (
                <FontItem
                  key={i}
                  font={font}
                  inputValue={value}
                  setValue={setValue}
                />
              )}
            </For>
          </div>
        </Setting>

        <Setting
          subtitle={
            <div className='flex items-center justify-between'>
              My Fonts
              <AddFontModal.Trigger>
                <Button
                  variant='ghost'
                  size='sm'
                  className='gap-1 text-xs hover:bg-foreground/5'
                >
                  <PlusIcon className='h-4 w-4' /> Add/Manage Fonts
                </Button>
              </AddFontModal.Trigger>
            </div>
          }
        >
          {!userFonts.length && (
            <div className='flex flex-col items-center justify-center gap-4'>
              <h2 className='text-xl font-bold'>Your fonts will appear here</h2>
              <AddFontModal.Trigger>
                <Button
                  variant='default'
                  size='lg'
                  className='text-md gap-2 px-5'
                >
                  <PlusIcon className='h-6 w-6' /> Add New Font
                </Button>
              </AddFontModal.Trigger>
            </div>
          )}
          <div className='grid max-h-full grid-cols-2 gap-4'>
            {!!userFonts.length && (
              <For each={userFonts}>
                {(font, i) => (
                  <FontItem
                    key={i}
                    font={font as (typeof FONTS)[number]}
                    inputValue={value}
                    setValue={setValue}
                  />
                )}
              </For>
            )}
          </div>
        </Setting>
      </Setting>
      <AddFontModal.Content />
    </Dialog>
  )
}

const FontItem = ({
  font,
  inputValue,
}: {
  font: (typeof FONTS)[number]
  inputValue: string
  setValue: Dispatch<SetStateAction<string>>
  titleProps?: HTMLAttributes<HTMLElement>
}) => {
  const { currentFont } = AppStore.useStore('currentFont')
  return (
    <RadioCard
      className='col-span-2 min-w-[12rem] overflow-x-hidden md:col-span-1'
      onClick={() => AppStore.set({ currentFont: font })}
      isActive={currentFont === font}
    >
      <RadioCardDescription
        style={{
          fontFamily: generateFontCss(font),
        }}
      >
        {font}
      </RadioCardDescription>
      <RadioCardContent>
        <p className='text-xl' style={{ fontFamily: generateFontCss(font) }}>
          {inputValue}
        </p>
      </RadioCardContent>
    </RadioCard>
  )
}
