/* eslint-disable react-hooks/rules-of-hooks */
import create from 'zustand-store-addons'
import { createSelector } from 'better-zustand-selector'
import { StoreApi, UseBoundStore } from 'zustand'
import { toast } from '@/components/ui/use-toast'
import { AppStore } from './app-store'

type TimerStore = {
  interval: NodeJS.Timeout | null
  startTime: number
  isRunning: boolean
  isPaused: boolean
  hasTimerEnded: boolean
  timeLeft: number
  timeInt: number
  totalTime: number

  updateTimeBy: (time: number) => void
  setTotalTime: (time: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
}

const store = create<TimerStore>(
  (set, get) => ({
    totalTime: 0,
    interval: null,
    startTime: 0,
    isPaused: false,
    timeLeft: 0,
    hasTimerEnded: false,
    isRunning: false,
    timeInt: 0,

    updateTimeBy(dTime) {
      set((s) => ({ timeLeft: s.timeLeft + dTime }))
    },

    setTotalTime(time) {
      set({
        hasTimerEnded: false,
        totalTime: time,
        timeLeft: time,
      })
    },

    startTimer() {
      const state = get()
      if (state.interval) clearInterval(state.interval)

      const interval = setInterval(() => {
        set((prev) => {
          if (prev.timeLeft <= 0) {
            clearInterval(interval)
            return {
              hasTimerEnded: true,
              interval: null,
              isPaused: false,
              timeLeft: state.totalTime,
            }
          }
          return {
            timeLeft: prev.timeLeft - 0.1,
          }
        })
      }, 100)
      set({ hasTimerEnded: false, interval, isPaused: false })
    },
    pauseTimer() {
      const state = get()
      if (state.isPaused || !state.isRunning) return
      if (state.interval) clearInterval(state.interval)
      set({
        isPaused: true,
        timeLeft: state.timeLeft - 0.1,
      })
    },
    resetTimer() {
      const state = get()
      state.pauseTimer()
      set({
        hasTimerEnded: false,
        interval: null,
        isPaused: false,
        timeLeft: state.totalTime,
      })
    },
  }),
  {
    computed: {
      timeInt() {
        return this.timeLeft >> 0
      },
      isRunning() {
        return !!this.interval
      },
    },
  },
)

const useTimer = createSelector(store as UseBoundStore<StoreApi<TimerStore>>)

export const TimerStore = {
  store,
  useStore: useTimer,
  set: store.setState,
  get: store.getState,
}
