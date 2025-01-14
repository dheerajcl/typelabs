import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, Palette, Search } from 'lucide-react'
import { formatThemeName } from '@/utils/theme.utils'
import { cn } from '@/utils/class-names.utils'
import { applyTheme } from '@/utils/theme.utils'
import themes from '@/styles/theme-list.json'
import { AppStore } from '@/state/app-store'
import Fuse from 'fuse.js'
import { clamp } from '@/utils/math.utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { For } from './map'

const fuse = new Fuse(themes, {
  keys: ['name', 'id'],
  threshold: 0.4,
})

const DIRECTION_MAP = {
  ArrowUp: -1,
  ArrowDown: 1,
}

export const ThemeSwitcherList = () => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const { theme: currentTheme } = AppStore.useStore('theme')
  const [isOpen, setIsOpen] = useState(false)
  const [focusedTheme, setFocusedTheme] = useState(currentTheme)
  const [search, setSearch] = useState('')
  const [isHoverDisabled, setIsHoverDisabled] = useState(false)

  // Optimized search filtering using useMemo to prevent unnecessary recalculations
  const filteredThemes = useMemo(() => {
    if (!search) return themes
    return fuse.search(search).map((result) => result.item)
  }, [search])

  const updateTheme = () => AppStore.set({ theme: focusedTheme })

  const handleKeyboardNavigation = (e: KeyboardEvent) => {
    if (!(e.key in DIRECTION_MAP)) return
    if (filteredThemes.length === 0) return

    setFocusedTheme((prev) => {
      const currIdx = filteredThemes.findIndex((s) => s.name === prev)
      if (currIdx === -1) return prev

      setIsHoverDisabled(true)

      const direction = DIRECTION_MAP[e.key as keyof typeof DIRECTION_MAP]
      const newIndex = clamp(0, currIdx + direction, filteredThemes.length - 1)

      const newTheme = filteredThemes[newIndex]
      if (!newTheme) return prev

      document.getElementById(`style-${newTheme.id}`)?.scrollIntoView({
        inline: 'nearest',
        block: 'nearest',
      })

      return newTheme.name
    })

    if (e.key === 'Enter') updateTheme()
  }

  const onMouseMove = () => setIsHoverDisabled(false)

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('keydown', handleKeyboardNavigation)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('keydown', handleKeyboardNavigation)
    }
  }, [isOpen, search, focusedTheme])

  useEffect(() => {
    if (!isOpen || !filteredThemes.length) return
    setFocusedTheme(filteredThemes[0].name)
  }, [filteredThemes, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const timeout = setTimeout(() => applyTheme(focusedTheme), 100)
    return () => clearTimeout(timeout)
  }, [focusedTheme, isOpen])

  type Theme = (typeof themes)[0]

  const renderThemeItem = useCallback(
    (theme: Theme) => {
      if (!theme) return null

      const { id, name, mainColor, textColor, subColor } = theme
      const isFocusedTheme = name === focusedTheme
      const isCurrentTheme = name === currentTheme

      return (
        <div
          key={id}
          id={`style-${id}`}
          onMouseEnter={() => !isHoverDisabled && setFocusedTheme(name)}
          onClick={updateTheme}
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-sm border border-transparent px-2 py-1 text-foreground',
            isCurrentTheme && 'border-primary/50 bg-primary/20 shadow-md',
            isFocusedTheme && 'bg-foreground/20',
          )}
        >
          <p className={cn(isCurrentTheme && 'flex items-center gap-1')}>
            {isCurrentTheme ? (
              <Check className='-mb-1 h-4 w-4' />
            ) : (
              <span className='mr-1 text-xs text-muted-foreground'>{id}.</span>
            )}
            {formatThemeName(name)}
          </p>
          <div className='flex gap-1'>
            <For each={[mainColor, textColor, subColor]}>
              {(color, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: color }}
                  className='flex h-3 w-3 items-center gap-1 rounded-full border border-foreground'
                />
              )}
            </For>
          </div>
        </div>
      )
    },
    [focusedTheme, currentTheme, isHoverDisabled, formatThemeName],
  )

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open)
        !open && applyTheme(currentTheme)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant='ghost'
          className='h-fit gap-1 text-xs text-muted-foreground'
        >
          <Palette className='h-3 w-3' />
          {currentTheme}
        </Button>
      </DialogTrigger>
      <DialogContent className='flex h-fit max-h-[80%] min-w-full flex-col overflow-hidden sm:min-w-[80%]'>
        <DialogHeader className='w-full'>
          <DialogTitle className='text-xl font-semibold'>Themes</DialogTitle>
          <DialogDescription>
            Select a theme to change the color scheme of the app.
            <br />
            You can also search for a theme by name or the index.
          </DialogDescription>
        </DialogHeader>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          startIcon={<Search className='h-4 w-4' />}
          placeholder='Search'
          className='bg w-full border border-border'
        />

        <div
          ref={scrollerRef}
          className='scroll flex flex-col gap-1 overflow-y-auto'
        >
          <For
            each={filteredThemes}
            whenEmpty={<h2 className='px-2 font-bold'>No themes found :(</h2>}
          >
            {renderThemeItem}
          </For>
        </div>
      </DialogContent>
    </Dialog>
  )
}
