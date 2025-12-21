export type KPI = {
  key: string
  label: string
  value: number
  trend?: number // %
}

export type AnalyticsSummary = {
  revenue: number
  activeUsers: number
  conversionRate: number
}

export type TimeRange = '7d' | '30d' | '90d'

export type TimeSeriesPoint = {
  label: string
  value: number
}

export type AnalyticsSeries = Record<
  TimeRange,
  {
    revenue: TimeSeriesPoint[]
    users: TimeSeriesPoint[]
  }
>

export type AnalyticsRow = {
  id: number
  name: string
  revenue: number
  sessions: number
}

export type SortKey = 'revenue' | 'sessions' | 'name'
export type SortDirection = 'asc' | 'desc'

export type AnalyticsColumn = {
  key: 'name' | 'revenue' | 'sessions'
  label: string
  visible: boolean
}
