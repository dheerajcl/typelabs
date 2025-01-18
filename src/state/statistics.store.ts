import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type KeyStats = {
  key: string
  accuracy: number
  speed: number
  usageCount: number
}

export type TestResult = {
  id: string
  timestamp: number
  wpm: number
  rawWpm: number
  accuracy: number
  duration: number
  keyStrokes: KeyStats[]
  errorKeys: string[]
  consistencyScore: number
  originalText: string | null
}

type StatisticsStore = {
  testHistory: TestResult[]
  averageWPM: number
  bestWPM: number
  totalTests: number
  totalTime: number
  keyAccuracy: Record<string, KeyStats>
  resetProgress: () => void
  
  addTestResult: (result: Omit<TestResult, 'id' | 'timestamp'>) => void
  getDailyProgress: () => TestResult[]
  getWeeklyProgress: () => { timestamp: number; wpm: number; accuracy: number }[]
  getKeyboardHeatmap: () => Record<string, number>
  getErrorPatterns: () => { pattern: string; expected: string; typed: string; count: number }[]
}

export const useStatisticsStore = create(
  persist<StatisticsStore>(
    (set, get) => ({
      testHistory: [],
      averageWPM: 0,
      bestWPM: 0,
      totalTests: 0,
      totalTime: 0,
      keyAccuracy: {},

      resetProgress: () => set({
        testHistory: [],
        averageWPM: 0,
        bestWPM: 0,
        totalTests: 0,
        totalTime: 0,
        keyAccuracy: {}
      }),

      addTestResult: (result) => {
        const newResult = {
          ...result,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        }
        
        const processedErrorKeys: string[] = []
        result.keyStrokes.forEach((stroke, index) => {
          if (stroke.accuracy < 1) {
            const actualTyped = stroke.key
            const expectedChar = result.originalText?.[index] || ''
            if (expectedChar !== actualTyped) {
              processedErrorKeys.push(`${expectedChar}->${actualTyped}`)
            }
          }
        })
        
        newResult.errorKeys = processedErrorKeys
        
        const history = [...get().testHistory, newResult]
        const totalTests = history.length
        const averageWPM = history.reduce((acc, curr) => acc + curr.wpm, 0) / totalTests
        const bestWPM = Math.max(get().bestWPM, result.wpm)
        
        const keyAccuracy = { ...get().keyAccuracy }
        result.keyStrokes.forEach(stroke => {
          if (!keyAccuracy[stroke.key]) {
            keyAccuracy[stroke.key] = { ...stroke }
          } else {
            const existing = keyAccuracy[stroke.key]
            existing.accuracy = (existing.accuracy * existing.usageCount + stroke.accuracy) / (existing.usageCount + 1)
            existing.speed = (existing.speed * existing.usageCount + stroke.speed) / (existing.usageCount + 1)
            existing.usageCount += stroke.usageCount
          }
        })
        
        set({
          testHistory: history,
          averageWPM,
          bestWPM,
          totalTests,
          totalTime: get().totalTime + result.duration,
          keyAccuracy
        })
      },

      getDailyProgress: () => {
        const startOfDay = new Date().setHours(0, 0, 0, 0)
        return get().testHistory
          .filter(test => test.timestamp >= startOfDay)
          .sort((a, b) => a.timestamp - b.timestamp)
      },

      getWeeklyProgress: () => {
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        const dailyData: Record<string, TestResult[]> = {}

        get().testHistory
          .filter(test => test.timestamp > weekAgo)
          .forEach(test => {
            const day = new Date(test.timestamp).toDateString()
            if (!dailyData[day]) {
              dailyData[day] = []
            }
            dailyData[day].push(test)
          })

        return Object.entries(dailyData)
          .map(([day, tests]) => ({
            timestamp: new Date(day).getTime(),
            wpm: tests.reduce((sum, test) => sum + test.wpm, 0) / tests.length,
            accuracy: tests.reduce((sum, test) => sum + test.accuracy, 0) / tests.length,
          }))
          .sort((a, b) => a.timestamp - b.timestamp)
      },

      getKeyboardHeatmap: () => {
        const heatmap: Record<string, number> = {}
        Object.entries(get().keyAccuracy).forEach(([key, stats]) => {
          heatmap[key] = stats.usageCount
        })
        return heatmap
      },

      getErrorPatterns: () => {
        const patterns: Record<string, { expected: string; typed: string; count: number }> = {}
        
        get().testHistory.forEach(test => {
          test.errorKeys.forEach(error => {
            if (!error.includes('->')) return
            
            const [expected, typed] = error.split('->')
            if (expected === typed) return
            
            const key = `${expected}->${typed}`
            if (!patterns[key]) {
              patterns[key] = { expected, typed, count: 1 }
            } else {
              patterns[key].count++
            }
          })
        })
        
        return Object.entries(patterns)
          .map(([pattern, data]) => ({
            pattern,
            expected: data.expected,
            typed: data.typed,
            count: data.count
          }))
          .sort((a, b) => b.count - a.count)
      }
    }),
    {
      name: 'typing-statistics'
    }
  )
)

