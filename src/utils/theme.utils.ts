import { Theme } from '@/styles/theme.type'
import { failable } from './errors.utils'

async function getThemeFromName(name: string) {
  const res = await import(`@/styles/themes/theme_${name}.ts`).then(
    (m) => m.default,
  )
  return res
}

function getThemeFromLocalStorage() {
  const savedTheme = localStorage.getItem('theme_data')
  if (!savedTheme) return null
  const [err, parsed] = failable(() => JSON.parse(atob(savedTheme)))
  if (err != null) return null
  return parsed as Theme
}

export async function saveThemeToLocalStorage(theme: string | Theme) {
  if (typeof theme == 'string') {
    theme = await getThemeFromName(theme)
  }
  const themeEncrypted = btoa(JSON.stringify(theme))
  localStorage.setItem('theme_data', themeEncrypted)
}

export async function applyTheme(theme: string | Theme) {
  if (typeof theme === 'string') {
    const savedTheme = getThemeFromLocalStorage()
    if (savedTheme && savedTheme.name == theme) {
      theme = savedTheme
    } else {
      theme = await getThemeFromName(theme)
    }
  }
  const root = document.documentElement
  Object.entries(theme).forEach(([key, val]) => {
    if (key == 'name') return
    root.style.setProperty(key, val)
  })
}

export function applySavedTheme() {
  const savedTheme = getThemeFromLocalStorage()
  if (!savedTheme) return
  applyTheme(savedTheme)
}

export const formatThemeName = (name: string) => {
  let formattedName = name.replace(/_/g, ' ')
  formattedName =
    formattedName.charAt(0).toUpperCase() + formattedName.substring(1)
  return formattedName
}
