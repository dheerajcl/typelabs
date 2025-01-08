export enum CaretStyle {
  Line = 'line',
  Underline = 'underline',
  Block = 'block',
  Box = 'box',
}

export const DEFAULT_CARET_STYLE = CaretStyle.Line

export enum CaretSmoothness {
  Off = 'off',
  Fast = 'fast',
  Medium = 'medium',
  Slow = 'slow',
}

export const caretSmoothnessValues = {
  [CaretSmoothness.Off]: 0,
  [CaretSmoothness.Fast]: 0.1,
  [CaretSmoothness.Medium]: 0.2,
  [CaretSmoothness.Slow]: 0.3,
} as const

export const DEFAULT_CARET_SMOOTHNESS = CaretSmoothness.Fast
