<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  data: number[]
  width?: number
  height?: number
}>()

const width = props.width ?? 120
const height = props.height ?? 36
const padding = 4

const max = computed(() => Math.max(...props.data, 1))
const min = computed(() => Math.min(...props.data, 0))

const points = computed(() => {
  const range = max.value - min.value || 1
  return props.data
    .map((v, i) => {
      const x =
        padding +
        (i * (width - padding * 2)) /
          Math.max(props.data.length - 1, 1)
      const y =
        height -
        padding -
        ((v - min.value) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')
})

const draw = ref(false)
onMounted(() => (draw.value = true))
</script>

<template>
  <svg :width="width" :height="height" class="text-slate-400">
    <polyline
      :points="points"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      :style="{
        strokeDasharray: 400,
        strokeDashoffset: draw ? 0 : 400,
        transition: 'stroke-dashoffset 200ms ease-out'
      }"
    />
  </svg>
</template>
