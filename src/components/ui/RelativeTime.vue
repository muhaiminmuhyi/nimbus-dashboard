<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ time: number }>()

const label = computed(() => {
  const diff = Math.floor((Date.now() - props.time) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
})
</script>

<template>
  <span class="text-xs text-slate-500">{{ label }}</span>
</template>
