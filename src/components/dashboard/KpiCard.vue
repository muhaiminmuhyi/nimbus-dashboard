<script setup lang="ts">
import SparkLine from '../charts/SparkLine.vue';
import CountUp from '../ui/CountUp.vue'
import { useRouter } from 'vue-router'

const _props = defineProps<{
  label: string
  value: number
  trend?: number
  link?: string
  sparkline?: number[]
}>()

const router = useRouter()
</script>

<template>
  <div
    class="rounded-xl p-4 cursor-pointer transition-all duration-200
           hover:shadow-md hover:-translate-y-0.5"
    :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
    @click="_props.link && router.push(_props.link)"
  >
    <div class="flex items-center justify-between">
      <p class="text-sm text-slate-500">
        {{ _props.label }}
      </p>
      <SparkLine
        v-if="_props.sparkline"
        :data="_props.sparkline"
      />
    </div>

    <p class="text-2xl font-semibold mt-2">
      <CountUp :value="_props.value" />
    </p>

    <p
      v-if="_props.trend !== undefined"
      class="text-xs mt-1"
      :class="_props.trend >= 0 ? 'text-green-600' : 'text-red-600'"
    >
      {{ _props.trend }}%
    </p>
  </div>
</template>
