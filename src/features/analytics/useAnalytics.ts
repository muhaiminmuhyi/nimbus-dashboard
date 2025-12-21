import { ref, computed, watch } from "vue";
import type {
  KPI,
  AnalyticsSummary,
  TimeRange,
  AnalyticsSeries,
  AnalyticsRow,
  SortKey,
  SortDirection,
  AnalyticsColumn,
} from "./analytics.types";

type SummaryByRange = Record<TimeRange, AnalyticsSummary>;

export function useAnalytics() {
  const STORAGE_KEY = "nimbus.analytics.columns";
  const loading = ref(true);
  const error = ref<string | null>(null);

  const range = ref<TimeRange>("7d");
  const ROW_HEIGHT = 48; // px
  const VIEWPORT_HEIGHT = 360; // px

  const scrollTop = ref(0);

  const startIndex = computed(() => Math.floor(scrollTop.value / ROW_HEIGHT));

  const visibleCount = computed(
    () => Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + 2 // buffer
  );

  const endIndex = computed(() => startIndex.value + visibleCount.value);

  const generateRows = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      revenue: Math.floor(Math.random() * 100_000_000),
      sessions: Math.floor(Math.random() * 2000),
    }))
  }

  // mock backend response by range
  const summaries = ref<SummaryByRange>({
    "7d": {
      revenue: 32000000,
      activeUsers: 120,
      conversionRate: 2.8,
    },
    "30d": {
      revenue: 128000000,
      activeUsers: 342,
      conversionRate: 3.4,
    },
    "90d": {
      revenue: 356000000,
      activeUsers: 820,
      conversionRate: 3.9,
    },
  });

  const series = ref<AnalyticsSeries>({
    "7d": {
      revenue: [
        { label: "Mon", value: 4 },
        { label: "Tue", value: 6 },
        { label: "Wed", value: 5 },
        { label: "Thu", value: 8 },
        { label: "Fri", value: 7 },
        { label: "Sat", value: 9 },
        { label: "Sun", value: 6 },
      ],
      users: [
        { label: "Mon", value: 40 },
        { label: "Tue", value: 52 },
        { label: "Wed", value: 48 },
        { label: "Thu", value: 60 },
        { label: "Fri", value: 55 },
        { label: "Sat", value: 70 },
        { label: "Sun", value: 58 },
      ],
    },
    "30d": {
      revenue: Array.from({ length: 6 }).map((_, i) => ({
        label: `W${i + 1}`,
        value: 20 + i * 5,
      })),
      users: Array.from({ length: 6 }).map((_, i) => ({
        label: `W${i + 1}`,
        value: 180 + i * 30,
      })),
    },
    "90d": {
      revenue: Array.from({ length: 3 }).map((_, i) => ({
        label: `M${i + 1}`,
        value: 80 + i * 40,
      })),
      users: Array.from({ length: 3 }).map((_, i) => ({
        label: `M${i + 1}`,
        value: 400 + i * 150,
      })),
    },
  });

  const revenueSeries = computed(() => series.value[range.value].revenue);
  const userSeries = computed(() => series.value[range.value].users);

  const fetchAnalytics = async () => {
    loading.value = true;
    error.value = null;

    try {
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      error.value = "Failed to load analytics";
    } finally {
      loading.value = false;
    }
  };

  const currentSummary = computed(() => summaries.value[range.value]);

  const kpis = computed<KPI[]>(() => {
    const s = currentSummary.value;
    if (!s) return [];

    return [
      {
        key: "revenue",
        label: "Revenue",
        value: s.revenue,
      },
      {
        key: "users",
        label: "Active Users",
        value: s.activeUsers,
      },
      {
        key: "conversion",
        label: "Conversion Rate",
        value: s.conversionRate,
      },
    ];
  });

  const tableData = ref<Record<TimeRange, AnalyticsRow[]>>({
    "7d": generateRows(1000),
    "30d": generateRows(5000),
    "90d": generateRows(10000),
  });

  const sortKey = ref<SortKey>("revenue");
  const sortDirection = ref<SortDirection>("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey.value === key) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortKey.value = key;
      sortDirection.value = "desc";
    }
  };

  const analyticsRows = computed(() => {
    const rows = tableData.value[range.value] || [];
    const sorted = [...rows].sort((a, b) => {
      const dir = sortDirection.value === "asc" ? 1 : -1;
      if (a[sortKey.value] < b[sortKey.value]) return -1 * dir;
      if (a[sortKey.value] > b[sortKey.value]) return 1 * dir;
      return 0;
    });
    return sorted;
  });

  const defaultColumns: AnalyticsColumn[] = [
    { key: "name", label: "Client", visible: true },
    { key: "revenue", label: "Revenue", visible: true },
    { key: "sessions", label: "Sessions", visible: true },
  ];

  const columns = ref<AnalyticsColumn[]>(loadColumns());

  function loadColumns(): AnalyticsColumn[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultColumns;

      const parsed = JSON.parse(raw) as AnalyticsColumn[];

      // safety: validate shape
      if (!Array.isArray(parsed)) return defaultColumns;

      return defaultColumns.map((col) => {
        const saved = parsed.find((p) => p.key === col.key);
        return saved ? { ...col, visible: saved.visible } : col;
      });
    } catch {
      return defaultColumns;
    }
  }

  const columnOrder: AnalyticsColumn["key"][] = ["name", "revenue", "sessions"];

  const visibleColumns = computed(() =>
    columnOrder
      .map((key) => columns.value.find((c) => c.key === key))
      .filter((c): c is AnalyticsColumn => !!c && c.visible)
  );

  const toggleColumn = (key: AnalyticsColumn["key"]) => {
    const visibleCount = columns.value.filter((c) => c.visible).length;
    const col = columns.value.find((c) => c.key === key);

    if (!col) return;

    // prevent hiding last column
    if (visibleCount === 1 && col.visible) return;

    col.visible = !col.visible;
  };

  watch(
    columns,
    (value) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(value.map(({ key, visible }) => ({ key, visible })))
      );
    },
    { deep: true }
  );

  const resetColumns = () => {
    columns.value = defaultColumns.map((c) => ({ ...c }));
    localStorage.removeItem(STORAGE_KEY);
  };

  const virtualRows = computed(() =>
    analyticsRows.value.slice(startIndex.value, endIndex.value)
  );

  const totalHeight = computed(() => analyticsRows.value.length * ROW_HEIGHT);

  return {
    loading,
    error,
    range,
    kpis,
    revenueSeries,
    userSeries,
    analyticsRows,
    sortDirection,
    sortKey,
    visibleColumns,
    columns,
    resetColumns,
    fetchAnalytics,
    toggleSort,
    toggleColumn,
    virtualRows,
    totalHeight,
    scrollTop,
    ROW_HEIGHT,
    startIndex,
  };
}
