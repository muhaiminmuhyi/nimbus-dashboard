<template>
  <div
    class="rounded-lg shadow-sm overflow-hidden"
    :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
  >
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 dark:bg-slate-700">
          <tr>
            <th class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </th>
            <th class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </th>
            <th class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </th>
            <th class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </th>
            <th class="px-6 py-3">
              <div class="flex justify-end">
                <div class="h-4 w-1/2 bg-slate-200 rounded" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="n in rows"
            :key="n"
            class="border-t dark:border-t-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 animate-pulse"
          >
            <td class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </td>
            <td class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </td>
            <td class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </td>
            <td class="px-6 py-3">
              <div class="h-4 w-1/2 bg-slate-200 rounded" />
            </td>
            <td class="px-6 py-3">
              <div class="flex justify-end">
                <div class="h-4 w-1/2 bg-slate-200 rounded" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number;
  }>(),
  {
    rows: 5,
  }
);
</script>
