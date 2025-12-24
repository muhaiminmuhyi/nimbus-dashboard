<template>
  <button
    class="px-3 py-1.5 rounded-md text-sm border border-slate-200"
    @click="toggle"
    :aria-pressed="isDark"
    aria-label="Toggle dark mode"
  >
    {{ isDark ? '🌙 Dark' : '☀️ Light' }}
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const applyTheme = (dark: boolean) => {
  const html = document.documentElement
  html.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

const toggle = () => {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  applyTheme(isDark.value)
})
</script>
