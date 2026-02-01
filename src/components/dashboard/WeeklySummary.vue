<script setup lang="ts">
import Sparkline from "../charts/SparkLine.vue";

type WeeklySummaryItem = {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  sparkline?: number[];
};

const props = defineProps<{
  items: WeeklySummaryItem[];
}>();

const trendColor = (trend?: WeeklySummaryItem["trend"]) => {
  if (trend === "up") return "text-green-600";
  if (trend === "down") return "text-red-600";
  return "text-slate-400";
};

// helper
const getItem = (label: string) => props.items.find((i) => i.label === label);
</script>

<template>
  <div
    class="rounded-xl px-4 pt-3 pb-4 space-y-4"
    :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
  >
    <h3 class="text-sm font-semibold">
      This Week Summary
    </h3>

    <!-- TOP GRID: Revenue + Active Users -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Revenue -->
      <div
        v-if="getItem('Revenue')"
        class="space-y-1"
      >
        <p class="text-xs text-slate-500">
          Revenue
        </p>
        <p
          class="text-sm font-medium"
          :class="trendColor(getItem('Revenue')?.trend)"
        >
          {{ getItem("Revenue")?.value }}
        </p>
        <Sparkline
          v-if="getItem('Revenue')?.sparkline"
          :data="getItem('Revenue')!.sparkline!"
          :width="120"
          :height="32"
          class="opacity-70"
        />
      </div>

      <!-- Active Users -->
      <div
        v-if="getItem('Active Users')"
        class="space-y-1"
      >
        <p class="text-xs text-slate-500">
          Active Users
        </p>
        <p
          class="text-sm font-medium"
          :class="trendColor(getItem('Active Users')?.trend)"
        >
          {{ getItem("Active Users")?.value }}
        </p>
        <Sparkline
          v-if="getItem('Active Users')?.sparkline"
          :data="getItem('Active Users')!.sparkline!"
          :width="120"
          :height="32"
          class="opacity-70"
        />
      </div>
    </div>

    <!-- BOTTOM: Invoices (FULL WIDTH) -->
    <div
      v-if="getItem('Invoices')"
      class="space-y-1"
    >
      <p class="text-xs text-slate-500">
        Invoices
      </p>
      <p
        class="text-sm font-medium"
        :class="trendColor(getItem('Invoices')?.trend)"
      >
        {{ getItem("Invoices")?.value }}
      </p>
    </div>
  </div>
</template>
