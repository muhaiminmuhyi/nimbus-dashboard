<template>
  <RouterLink
    :to="to"
    class="block px-3 py-2 rounded-lg text-sm font-medium transition"
    :class="isActive ? activeClass : inactiveClass"
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

const activeClass =
  'bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text))] shadow-sm'

const inactiveClass =
  'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))] hover:bg-slate-100 dark:hover:bg-slate-700'
</script>
