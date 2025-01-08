import { Theme } from '@/styles/themes/theme.type'

export const applyTheme = (style: string) => {
  import(`@/styles/themes/theme_${style}.ts`)
    .then((module) => module['theme_' + style])
    .then((theme) => {
      const root = document.documentElement
      Object.keys(theme).forEach((key) => {
        root.style.setProperty(key, theme[key as keyof Theme])
      })
    })
}

export const formatThemeName = (name: string) => {
  let formattedName = name.replace(/_/g, ' ')
  formattedName =
    formattedName.charAt(0).toUpperCase() + formattedName.substring(1)
  return formattedName
}
