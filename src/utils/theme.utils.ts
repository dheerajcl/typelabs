import { AppStore } from '@/state/app-store'

export async function previewTheme(theme: string) {
  AppStore.set({ previewedTheme: theme })
}
export async function stopPreviewingTheme() {
  AppStore.set({ previewedTheme: null })
}

export const formatThemeName = (name: string) => {
  let formattedName = name.replace(/_/g, ' ')
  formattedName =
    formattedName.charAt(0).toUpperCase() + formattedName.substring(1)
  return formattedName
}
