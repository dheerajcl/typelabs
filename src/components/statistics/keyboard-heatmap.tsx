import { useMemo } from 'react'
import { QWERTY_LAYOUT } from '@/config/keyboard.config'
import { cn } from '@/utils/class-names.utils'

type KeyboardHeatmapProps = {
  data: Record<string, number>
}

export const KeyboardHeatmap = ({ data }: KeyboardHeatmapProps) => {
  const maxUsage = useMemo(() => Math.max(...Object.values(data)), [data])

  const getHeatColor = (usage: number) => {
    const intensity = usage / maxUsage
    // Use theme's heading color with varying opacity
    return `hsl(var(--foreground) / ${intensity * 0.8})`
  }

  return (
    <div className="grid gap-1 p-4">
      {QWERTY_LAYOUT.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <div
              key={key}
              className={cn(
                "h-10 w-10 rounded border border-border flex items-center justify-center",
                "font-mono text-sm transition-colors duration-200 text-foreground"
              )}
              style={{
                backgroundColor: getHeatColor(data[key] || 0)
              }}
            >
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}