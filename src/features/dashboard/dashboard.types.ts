export type KPI = {
  key: string
  label: string
  value: number
  trend?: number
  link?: string
}

export type ActionItem = {
  id: string
  label: string
  description: string
  severity: 'warning' | 'info'
  link: string
}

export type ActivityItem = {
  id: string
  message: string
  time: number // unix timestamp (ms)
  link?: string
}

export type WeeklySummaryItem = {
  label: string
  value: string
  trend?: 'up' | 'down' | 'neutral'
  sparkline?: number[]
}
