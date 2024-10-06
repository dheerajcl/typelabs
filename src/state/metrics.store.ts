import { create } from 'zustand'
import { createSelector } from 'better-zustand-selector'

export type Metrics = {
  errorPercentage: number
  wpm: number
  rawWpm: number
  cpm: number
}

export type MetricsStore = Metrics & {
  updateMetrics: (metrics: Metrics) => void
}

export const metricsStore = create<MetricsStore>((set) => ({
  errorPercentage: 0,
  wpm: 0,
  rawWpm: 0,
  cpm: 0,
  updateMetrics: (metrics: Metrics) => {
    set(metrics)
  },
}))

export const useMetricsStore = createSelector(metricsStore)
