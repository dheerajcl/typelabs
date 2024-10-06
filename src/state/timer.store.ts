import create from 'zustand-store-addons'
import { createSelector } from 'better-zustand-selector'
import { StoreApi, UseBoundStore } from 'zustand'

type TimerStore = {
  interval: NodeJS.Timeout | null
  isRunning: boolean
  isPaused: boolean
  hasTimerEnded: boolean
  totalTime: number
  timeLeft: number
  timeInt: number

  setIsRunning: (bool: boolean) => void
  setIsPaused: (bool: boolean) => void
  setHasTimerEnded: (bool: boolean) => void
  setInterval: (interval: TimerStore['interval']) => void
  setTimeLeft: (time: number, updateBy?: boolean) => void
  updateTimeBy: (time: number) => void
  setTotalTime: (time: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
}

export const timerStore = create<TimerStore>(
  (set) => ({
    totalTime: 0,
    interval: null,
    isPaused: false,
    timeLeft: 0,
    // TODO: Redundant assignment of computed keys. Find a way to get rid of this.
    hasTimerEnded: false,
    isRunning: false,
    timeInt: 0,

    setIsRunning: (isRunning: boolean) => {
      set({ isRunning })
    },
    setIsPaused: (isPaused: boolean) => {
      set({ isPaused })
    },
    setInterval: (interval: TimerStore['interval']) => {
      set({ interval })
    },
    setHasTimerEnded: (hasTimerEnded: boolean) => {
      set({ hasTimerEnded })
    },
    setTimeLeft: (timeLeft: number) => {
      set({ timeLeft })
    },
    updateTimeBy: (dTime: number) => {
      set((s) => ({ timeLeft: s.timeLeft + dTime }))
    },
    setTotalTime: (time: number) => {
      set({
        hasTimerEnded: false,
        totalTime: time,
        timeLeft: time,
      })
    },

    startTimer: () => {
      set((state) => {
        if (state.interval) clearInterval(state.interval)

        const interval = setInterval(() => state.updateTimeBy(-0.1), 100)
        return { hasTimerEnded: false, interval, isPaused: false }
      })
    },
    pauseTimer: () => {
      set((state) => {
        if (!state.isPaused && state.isRunning) {
          if (state.interval) clearInterval(state.interval)
          return { isPaused: true, timeLeft: state.timeLeft - 1 }
        }
        return state
      })
    },
    resetTimer: () => {
      set((state) => {
        state.pauseTimer()
        return {
          interval: null,
          isPaused: false,
          timeLeft: state.totalTime,
        }
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

export const useTimer = createSelector(
  timerStore as UseBoundStore<StoreApi<TimerStore>>,
)
