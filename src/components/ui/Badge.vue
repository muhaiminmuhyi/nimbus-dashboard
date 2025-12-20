<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'success' | 'warning' | 'error' | 'info'

const props = withDefaults(defineProps<{
  tone?: Tone
}>(), {
  tone: 'info',
})

const base =
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'

const tones: Record<Tone, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
}

const classes = computed(() => [
  base,
  tones[props.tone],
])
</script>
