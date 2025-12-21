import { ref, onMounted } from "vue";
import type {
  ActionItem,
  ActivityItem,
  KPI,
  WeeklySummaryItem,
} from "./dashboard.types";

export function useDashboard() {
  const loading = ref(true);

  const kpis = ref<KPI[]>([]);

  const actions = ref<ActionItem[]>([]);

  const miniTrends = {
    revenue7d: [8, 10, 9, 12, 14, 13, 15],
    users7d: [40, 42, 41, 44, 46, 45, 48],
  };

  const activities = ref<ActivityItem[]>([]);

  const weeklySummary = ref<WeeklySummaryItem[]>([]);

  const fetchDashboard = async () => {
    loading.value = true;

    await new Promise((r) => setTimeout(r, 600));

    kpis.value = [
      {
        key: "revenue",
        label: "Revenue (MTD)",
        value: 128000000,
        trend: 12.4,
        link: "/analytics",
      },
      {
        key: "users",
        label: "Active Users",
        value: 342,
        trend: -2.1,
        link: "/users",
      },
      {
        key: "invoices",
        label: "Pending Invoices",
        value: 5,
        link: "/billing",
      },
      {
        key: "conversion",
        label: "Conversion Rate",
        value: 3.4,
        trend: 0.8,
        link: "/analytics",
      },
    ];

    loading.value = false;
  };

  const fetchActions = async () => {
    await new Promise((r) => setTimeout(r, 400));

    actions.value = [
      {
        id: "overdue-invoice",
        label: "3 overdue invoices",
        description: "Some invoices require immediate attention",
        severity: "warning",
        link: "/billing",
      },
      {
        id: "pending-approval",
        label: "5 invoices pending approval",
        description: "Approval required to proceed billing",
        severity: "info",
        link: "/billing",
      },
      {
        id: "inactive-users",
        label: "2 inactive users",
        description: "Users inactive for more than 30 days",
        severity: "info",
        link: "/users",
      },
    ];
  };

  const fetchActivities = async () => {
    await new Promise((r) => setTimeout(r, 300));

    const now = Date.now();

    activities.value = [
      {
        id: "a1",
        message: "Invoice #INV-2301 approved",
        time: now - 2 * 60 * 1000, // 2 min ago
        link: "/billing",
      },
      {
        id: "a2",
        message: "User John added to Billing",
        time: now - 15 * 60 * 1000, // 15 min ago
        link: "/users",
      },
      {
        id: "a3",
        message: "Settings updated by Admin",
        time: now - 60 * 60 * 1000, // 1 hour ago
        link: "/settings",
      },
      {
        id: "a4",
        message: "Invoice #INV-2298 sent to client",
        time: now - 3 * 60 * 60 * 1000, // 3 hours ago
        link: "/billing",
      },
    ];
  };

  const fetchWeeklySummary = async () => {
    await new Promise((r) => setTimeout(r, 300));

    weeklySummary.value = [
      {
        label: "Revenue",
        value: "+12% vs last week",
        trend: "up",
        sparkline: [8, 10, 9, 12, 14, 13, 15],
      },
      {
        label: "Invoices",
        value: "3 approved, 1 overdue",
        trend: "neutral",
      },
      {
        label: "Active Users",
        value: "-2 users",
        trend: "down",
        sparkline: [42, 41, 40, 39, 41, 40, 38],
      },
    ];
  };

  onMounted(async () => {
    await fetchDashboard();
    await fetchActions();
    await fetchActivities();
    await fetchWeeklySummary();
  });

  return {
    loading,
    kpis,
    actions,
    miniTrends,
    activities,
    weeklySummary,
  };
}
