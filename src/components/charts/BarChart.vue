<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: { label: string; value: number }[]
}>()

const width = 400
const height = 160
const padding = 24

const max = computed(() =>
  Math.max(...props.data.map((d) => d.value), 0)
)

const barWidth = computed(
  () => (width - padding * 2) / props.data.length
)
</script>

<template>
  <svg :width="width" :height="height">
    <g v-for="(d, i) in data" :key="i">
      <rect
        :x="padding + i * barWidth"
        :y="
          height -
          padding -
          (d.value / max) * (height - padding * 2)
        "
        :width="barWidth - 6"
        :height="
          (d.value / max) * (height - padding * 2)
        "
        fill="currentColor"
      />
    </g>
  </svg>
</template>
