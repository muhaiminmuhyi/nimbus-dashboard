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

const points = computed(() =>
  props.data
    .map((d, i) => {
      const x =
        padding +
        (i * (width - padding * 2)) /
          Math.max(props.data.length - 1, 1)
      const y =
        height -
        padding -
        (d.value / max.value) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')
)
</script>

<template>
  <svg
    :width="width"
    :height="height"
  >
    <polyline
      :points="points"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    />
  </svg>
</template>
