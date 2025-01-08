import { AppStore } from '@/state/app-store'
import { applyTheme } from '@/utils/theme.utils'
import { useEffect } from 'react'

export const StyleProvider = () => {
  const root = document.documentElement
  const { currentFont, theme, borderRadius } = AppStore.useStore(
    'currentFont',
    'theme',
    'borderRadius',
  )

  useEffect(() => {
    root.attributeStyleMap.set('--radius', `${borderRadius}px`)
  }, [borderRadius])

  useEffect(() => {
    root.style.setProperty('--font-primary', currentFont)
  }, [currentFont])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return null
}
