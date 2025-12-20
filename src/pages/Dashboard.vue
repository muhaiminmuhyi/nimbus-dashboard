<template>
  <AppLayout title="Dashboard">
    <div class="space-y-6">
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="n in 4"
          :key="n"
          class="p-4 rounded-lg shadow-sm"
          :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
        >
          <p class="text-sm" style="color: rgb(var(--color-muted))">Metric {{ n }}</p>
          <p class="text-2xl font-semibold mt-2">123</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
</script>
