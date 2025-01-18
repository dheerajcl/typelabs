import { create } from 'zustand'
import { createSelector } from 'better-zustand-selector'
import { KeyStats } from './statistics.store'

export type Metrics = {
  errorPercentage: number
  wpm: number
  rawWpm: number
  cpm: number
  instantWpm: number
  wpmHistory: number[]
  errorHistory: number[]
  keyStrokes: KeyStats[]
  errorKeys: string[]
}

type MetricsStore = Metrics & {
  updateMetrics: (metrics: Metrics) => void
  addInstantMetrics: (wpm: number, isError: boolean) => void
  resetMetrics: () => void
}

export const metricsStore = create<MetricsStore>((set) => ({
  errorPercentage: 0,
  wpm: 0,
  rawWpm: 0,
  cpm: 0,
  instantWpm: 0,
  wpmHistory: [],
  errorHistory: [],
  keyStrokes: [],
  errorKeys: [],
  
  updateMetrics: (metrics: Metrics) => set(metrics),
  
  addInstantMetrics: (wpm: number, isError: boolean) => 
    set((state) => ({
      ...state,
      instantWpm: wpm,
      wpmHistory: [...state.wpmHistory, wpm],
      errorHistory: [...state.errorHistory, isError ? 1 : 0]
    })),
  
  resetMetrics: () => set({
    errorPercentage: 0,
    wpm: 0,
    rawWpm: 0,
    cpm: 0,
    instantWpm: 0,
    wpmHistory: [],
    errorHistory: [],
    keyStrokes: [],
    errorKeys: []
  })
}))

export const useMetricsStore = createSelector(metricsStore)