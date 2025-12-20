<template>
  <RouterLink
    :to="to"
    :class="classes"
  >
    {{ label }}
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps<{
  label: string
  to: string
}>()

const route = useRoute()

const isActive = computed(() => route.path === props.to)

const classes = computed(() => [
  'block px-3 py-2 rounded-lg text-sm transition',
  isActive.value
    ? 'bg-slate-800 text-white'
    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
])
</script>
