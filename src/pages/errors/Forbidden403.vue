<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  const html = document.documentElement
  html.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  applyTheme(isDark.value)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
    <div class="text-center max-w-md px-6">
      <h1 class="text-6xl font-bold text-slate-800 dark:text-white">403</h1>

      <p class="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
        Access Denied
      </p>

      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        You don’t have permission to access this page.
      </p>

      <div class="mt-6 flex justify-center gap-3">
        <button
          class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          @click="router.push('/')"
        >
          Back to Dashboard
        </button>

        <button
          class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600
                 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          @click="router.back()"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>
