import { Line, Bar } from 'react-chartjs-2'
import { useStatisticsStore } from '@/state/statistics.store'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { KeyboardHeatmap } from './keyboard-heatmap'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface StatCardProps {
  title: string
  value: string | number
  description: string
}

const StatCard = ({ title, value, description }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export const StatisticsDashboard = () => {
  const {
    averageWPM,
    bestWPM,
    totalTests,
    totalTime,
    getDailyProgress,
    getWeeklyProgress,
    getKeyboardHeatmap,
    getErrorPatterns,
    resetProgress
  } = useStatisticsStore()

  const dailyData = getDailyProgress()
  const weeklyData = getWeeklyProgress()
  const heatmapData = getKeyboardHeatmap()
  const errorPatterns = getErrorPatterns()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-foreground">Statistics</h2>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => {
            if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
              resetProgress()
            }
          }}
        >
          Reset Progress
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Average WPM"
          value={averageWPM.toFixed(1)}
          description="Your typical typing speed"
        />
        <StatCard
          title="Best WPM"
          value={bestWPM.toFixed(1)}
          description="Your highest achieved speed"
        />
        <StatCard
          title="Total Tests"
          value={totalTests}
          description="Number of completed tests"
        />
        <StatCard
          title="Practice Time"
          value={`${Math.floor(totalTime / 60)}m`}
          description="Total time spent typing"
        />
      </div>

      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="heatmap">Keyboard Heatmap</TabsTrigger>
          <TabsTrigger value="errors">Error Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
              <CardDescription>Your typing speed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="daily">
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Today</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                </TabsList>

                <TabsContent value="daily">
                  <Line
                    data={{
                      labels: dailyData.map(test => 
                        new Date(test.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      ),
                      datasets: [{
                        label: 'WPM',
                        data: dailyData.map(test => test.wpm),
                        borderColor: 'hsl(var(--primary))',
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        tension: 0.4,
                        fill: true
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'hsl(var(--border) / 0.2)'
                          },
                          ticks: {
                            color: 'hsl(var(--muted-foreground))',
                            callback: (value) => `${value} wpm`
                          }
                        },
                        x: {
                          grid: {
                            color: 'hsl(var(--border) / 0.2)'
                          },
                          ticks: {
                            color: 'hsl(var(--muted-foreground))'
                          }
                        }
                      }
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="weekly">
                  <Line
                    data={{
                      labels: weeklyData.map(day => 
                        new Date(day.timestamp).toLocaleDateString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })
                      ),
                      datasets: [{
                        label: 'Average WPM',
                        data: weeklyData.map(day => day.wpm),
                        borderColor: 'hsl(var(--primary))',
                        backgroundColor: 'hsl(var(--primary) / 0.1)',
                        tension: 0.4,
                        fill: true
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (context) => `Avg WPM: ${context.parsed.y.toFixed(1)}`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: {
                            color: 'hsl(var(--border) / 0.2)'
                          },
                          ticks: {
                            color: 'hsl(var(--muted-foreground))',
                            callback: (value) => `${value} wpm`
                          }
                        },
                        x: {
                          grid: {
                            color: 'hsl(var(--border) / 0.2)'
                          },
                          ticks: {
                            color: 'hsl(var(--muted-foreground))'
                          }
                        }
                      }
                    }}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Keyboard Usage Heatmap</CardTitle>
              <CardDescription>Visualization of key usage frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <KeyboardHeatmap data={heatmapData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Common Error Patterns</CardTitle>
              <CardDescription>Analysis of your typing mistakes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Bar
                  data={{
                    labels: errorPatterns.slice(0, 10).map(p => 
                      `'${p.expected}' → '${p.typed}'`
                    ),
                    datasets: [{
                      label: 'Error Count',
                      data: errorPatterns.slice(0, 10).map(p => p.count),
                      backgroundColor: 'hsl(var(--destructive) / 0.5)',
                      borderColor: 'hsl(var(--destructive))',
                      borderWidth: 1
                    }]
                  }}
                  options={{
                    indexAxis: 'y',
                    responsive: true,
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const total = errorPatterns.reduce((acc, p) => acc + p.count, 0)
                            const percentage = ((context.raw as number) / total * 100).toFixed(1)
                            return `${context.raw} times (${percentage}% of all errors)`
                          }
                        }
                      },
                      legend: { display: false }
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        grid: {
                          color: 'hsl(var(--muted-foreground) / 0.2)'
                        },
                        ticks: {
                          color: 'hsl(var(--muted-foreground))'
                        },
                        max: Math.max(...errorPatterns.slice(0, 10).map(p => p.count)) * 1.1
                      },
                      y: {
                        grid: {
                          display: false
                        },
                        ticks: {
                          color: 'hsl(var(--muted-foreground))',
                          font: {
                            family: 'monospace'
                          }
                        }
                      }
                    }
                  }}
                />
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-medium">Key Insights:</h4>
                  <div className="space-y-3">
                    {errorPatterns.slice(0, 3).map((pattern, i) => (
                      <div key={i} className="rounded-lg border p-3">
                        <p className="font-medium text-sm">Pattern {i + 1}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          You frequently type '{pattern.typed}' instead of '{pattern.expected}' 
                          ({pattern.count} times, {((pattern.count / errorPatterns.reduce((acc, p) => acc + p.count, 0)) * 100).toFixed(1)}% of errors)
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tip: Practice words containing '{pattern.expected}' to improve accuracy
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

