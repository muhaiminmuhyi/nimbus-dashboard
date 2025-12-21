<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  value: number
  duration?: number
}>()

const display = ref(0)
const duration = props.duration ?? 300

const animate = () => {
  const start = performance.now()
  const from = 0
  const to = props.value

  const frame = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    display.value = Math.floor(from + (to - from) * progress)

    if (progress < 1) requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

onMounted(animate)
watch(() => props.value, animate)
</script>

<template>
  <span>{{ display.toLocaleString('id-ID') }}</span>
</template>
