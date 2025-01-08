import sf from 'seconds-formater'

export const trim = (s: string): string => s.trim()

export const sf_s = (time: number) => sf.convert(time).format('MM:SS')
export const sf_ms = (time: number) => sf.convert(time / 1000).format('MM:SS')

export const generateFontCss = (font: string) =>
  `${font}, Roboto Mono, monospace`
