<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside
      class="w-64 flex flex-col"
      :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
    >
      <div class="h-14 flex items-center px-6 font-bold border-b dark:border-b-slate-600">
        Nimbus
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <NavItem label="Dashboard" to="/" />
        <NavItem label="Users" to="/users" />
        <NavItem label="Billing" to="/billing" />
        <NavItem label="Settings" to="/settings" />
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <header
        class="h-14 border-b dark:border-b-slate-600 flex items-center justify-between px-6"
        :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
      >
        <h1 class="font-semibold">{{ title }}</h1>

        <div class="flex items-center gap-3">
          <ThemeToggle />
          <div class="h-8 w-8 rounded-full bg-slate-400" />
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavItem from '../components/common/NavItem.vue'
import ThemeToggle from '../components/common/ThemeToggle.vue'

defineProps<{ title: string }>()
</script>