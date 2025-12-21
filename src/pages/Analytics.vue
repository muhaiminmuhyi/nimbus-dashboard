<script setup lang="ts">
import { onMounted } from "vue";
import AppLayout from "../layouts/AppLayout.vue";
import { useAnalytics } from "../features/analytics/useAnalytics";
import Button from "../components/ui/Button.vue";
import BarChart from "../components/charts/BarChart.vue";
import LineChart from "../components/charts/LineChart.vue";
import TableSkeleton from "../components/ui/TableSkeleton.vue";

const {
  loading,
  error,
  kpis,
  range,
  revenueSeries,
  userSeries,
  sortDirection,
  sortKey,
  columns,
  visibleColumns,
  fetchAnalytics,
  toggleSort,
  toggleColumn,
  scrollTop,
  virtualRows,
  totalHeight,
  ROW_HEIGHT,
  startIndex,
} = useAnalytics();

onMounted(() => {
  fetchAnalytics();
});

const formatNumber = (n: number) => new Intl.NumberFormat("id-ID").format(n);
</script>

<template>
  <AppLayout title="Analytics">
    <div class="space-y-6">
      <div>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Overview</h2>

          <div class="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              :aria-pressed="range === '7d'"
              @click="range = '7d'"
            >
              7d
            </Button>

            <Button
              size="sm"
              variant="secondary"
              :aria-pressed="range === '30d'"
              @click="range = '30d'"
            >
              30d
            </Button>

            <Button
              size="sm"
              variant="secondary"
              :aria-pressed="range === '90d'"
              @click="range = '90d'"
            >
              90d
            </Button>
          </div>
        </div>
        <p class="text-sm" :style="{ color: 'rgb(var(--color-muted))' }">
          Business performance overview
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-3 gap-4 animate-pulse">
        <div v-for="n in 3" :key="n" class="h-24 rounded-lg bg-slate-200" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-600">
        {{ error }}
      </div>

      <!-- KPI Cards -->
      <div v-else class="grid grid-cols-3 gap-4">
        <div
          v-for="kpi in kpis"
          :key="kpi.key"
          class="rounded-lg p-4"
          :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
        >
          <p class="text-sm" :style="{ color: 'rgb(var(--color-muted))' }">
            {{ kpi.label }}
          </p>

          <p class="text-2xl font-semibold mt-2">
            {{ formatNumber(kpi.value) }}
          </p>

          <p
            class="text-xs mt-1"
            :class="
              kpi.trend && kpi.trend >= 0 ? 'text-green-600' : 'text-red-600'
            "
          >
            {{ kpi.trend }}%
          </p>
        </div>
      </div>

      <!-- Loading Chart -->
      <div v-if="loading" class="grid grid-cols-2 gap-6 animate-pulse">
        <div v-for="n in 2" :key="n" class="h-48 rounded-lg bg-slate-200" />
      </div>

      <!-- Charts -->
      <div v-else class="grid grid-cols-2 gap-6">
        <div
          class="rounded-lg p-4"
          :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
        >
          <p class="text-sm mb-2">Revenue Trend</p>
          <LineChart :data="revenueSeries" />
        </div>

        <div
          class="rounded-lg p-4"
          :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
        >
          <p class="text-sm mb-2">Active Users</p>
          <BarChart :data="userSeries" />
        </div>
      </div>

      <!-- Loading Table -->
      <TableSkeleton v-if="loading" />

      <template v-else>
        <!-- Column Toggle -->
        <div class="flex items-center gap-4 text-sm mb-4">
          <span class="text-slate-500">Columns:</span>

          <label
            v-for="col in columns"
            :key="col.key"
            class="flex items-center gap-1 cursor-pointer"
          >
            <input
              type="checkbox"
              :checked="col.visible"
              @change="toggleColumn(col.key)"
              class="h-4 w-4"
            />
            {{ col.label }}
          </label>
        </div>

        <!-- Table Wrapper -->
        <div
          class="rounded-lg shadow-sm overflow-hidden"
          :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
        >
          <!-- HEADER TABLE -->
          <table class="w-full text-sm table-fixed">
            <thead class="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th
                  v-for="col in visibleColumns"
                  :key="col.key"
                  class="px-6 py-3 cursor-pointer select-none"
                  :class="col.key === 'name' ? 'text-left' : 'text-right'"
                  @click="toggleSort(col.key)"
                >
                  {{ col.label }}
                  <span v-if="sortKey === col.key">
                    {{ sortDirection === "asc" ? "▲" : "▼" }}
                  </span>
                </th>
              </tr>
            </thead>
          </table>

          <!-- VIRTUALIZED BODY -->
          <div
            class="relative overflow-auto"
            style="height: 360px"
            @scroll="scrollTop = ($event.target as HTMLElement).scrollTop"
          >
            <!-- Fake full height -->
            <div :style="{ height: totalHeight + 'px', position: 'relative' }">
              <!-- Actual rendered rows -->
              <table
                class="absolute top-0 left-0 w-full text-sm table-fixed"
                :style="{
                  transform: `translateY(${startIndex * ROW_HEIGHT}px)`,
                }"
              >
                <tbody>
                  <tr
                    v-for="row in virtualRows"
                    :key="row.id"
                    class="border-t dark:border-t-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                    :style="{ height: ROW_HEIGHT + 'px' }"
                  >
                    <td
                      v-for="col in visibleColumns"
                      :key="col.key"
                      class="px-6 py-2"
                      :class="
                        col.key === 'name'
                          ? 'text-left font-medium'
                          : 'text-right'
                      "
                    >
                      {{ row[col.key] }}
                    </td>
                  </tr>

                  <!-- EMPTY STATE -->
                  <tr v-if="virtualRows.length === 0">
                    <td
                      :colspan="visibleColumns.length"
                      class="px-6 py-6 text-center text-slate-500"
                    >
                      No analytics data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </AppLayout>
</template>
