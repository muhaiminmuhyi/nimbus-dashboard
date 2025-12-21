<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  label: string
  description: string
  severity: 'warning' | 'info'
  link: string
}>()

const router = useRouter()
</script>

<template>
  <div
    class="rounded-lg p-4 cursor-pointer transition-all duration-200
           hover:shadow-sm hover:-translate-y-0.5"
    :class="
      severity === 'warning'
        ? 'bg-orange-50 dark:bg-orange-900/20'
        : 'bg-slate-50 dark:bg-slate-800'
    "
    @click="router.push(link)"
  >
    <p
      class="text-sm font-medium"
      :class="
        severity === 'warning'
          ? 'text-orange-700 dark:text-orange-400'
          : 'text-slate-700 dark:text-slate-200'
      "
    >
      {{ label }}
    </p>

    <p class="text-xs mt-1 text-slate-500">
      {{ description }}
    </p>
  </div>
</template>
