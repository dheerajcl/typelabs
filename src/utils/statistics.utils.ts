import { KeyStats } from '@/state/statistics.store'

export const calculateConsistency = (keyStrokes: KeyStats[]) => {
    if (keyStrokes.length < 2) return 100
  
    const speeds = keyStrokes.map(k => k.speed)
    const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length
    const variance = speeds.reduce((a, b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.length
    
    // Convert to percentage where lower variance = higher consistency
    return Math.max(0, 100 - (Math.sqrt(variance) * 10))
  }