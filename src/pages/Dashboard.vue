<script setup lang="ts">
import AppLayout from "../layouts/AppLayout.vue";
import KpiCard from "../components/dashboard/KpiCard.vue";
import { useDashboard } from "../features/dashboard/useDashboard";
import ActionItem from "../components/dashboard/ActionItem.vue";
import ActivityItem from "../components/dashboard/ActivityItem.vue";
import WeeklySummary from "../components/dashboard/WeeklySummary.vue";

const { loading, kpis, actions, miniTrends, activities, weeklySummary } = useDashboard();
</script>

<template>
  <AppLayout title="Dashboard">
    <div class="space-y-6">
      <h2 class="text-lg font-semibold">Overview</h2>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-4 gap-4 animate-pulse">
        <div v-for="n in 4" :key="n" class="h-24 rounded-xl bg-slate-200" />
      </div>

      <!-- KPI -->
      <div v-else class="grid grid-cols-4 gap-4">
        <KpiCard
          v-for="kpi in kpis"
          v-bind="kpi"
          :sparkline="
            kpi.key === 'revenue'
              ? miniTrends.revenue7d
              : kpi.key === 'users'
              ? miniTrends.users7d
              : undefined
          "
        />
      </div>

      <div class="grid grid-cols-3 gap-6">
        <!-- Action Required -->
        <div class="col-span-1 space-y-3 animate-fade-in">
          <h3 class="text-sm font-semibold">Action Required</h3>

          <div v-if="actions.length === 0" class="text-sm text-slate-500">
            No actions required 🎉
          </div>

          <ActionItem
            v-for="action in actions"
            :key="action.id"
            v-bind="action"
          />
        </div>

        <!-- Weekly Summary (ISI AREA KOSONG) -->
        <div class="col-span-2">
          <h3 class="text-sm font-semibold mt-3">&nbsp;</h3>
          <WeeklySummary :items="weeklySummary" />
        </div>
      </div>

      <div class="h-px bg-slate-700/40 my-3" />
      
      <div class="space-y-3">
        <h3 class="text-sm font-semibold">Recent Activity</h3>

        <div v-if="activities.length === 0" class="text-sm text-slate-500">
          No recent activity
        </div>

        <ActivityItem
          v-for="(activity, index) in activities"
          :key="activity.id"
          v-bind="activity"
          :highlight="index === 0"
        />
      </div>
    </div>
  </AppLayout>
</template>
