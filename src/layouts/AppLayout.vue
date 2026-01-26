<script setup lang="ts">
import { computed } from "vue";
import NavItem from "../components/common/NavItem.vue";
import ThemeToggle from "../components/common/ThemeToggle.vue";
import { useAuthStore } from "../stores/auth";
import { useCan } from "../features/authentication/useCan";
import Dropdown from "../components/ui/Dropdown.vue";

const auth = useAuthStore();
const { can } = useCan();

const dropdownItems = [
  { key: "logout", label: "Logout", danger: true },
]

const menus = computed(() => {
  return auth.menus.filter((m) => can(m.permission));
});

const onSelect = (item: {key: string}) => {
  if (item.key === "logout") {
    auth.logout();
  }
}

defineProps<{ title: string }>();
</script>
<template>
  <div class="min-h-screen flex">
    <!-- Sidebar -->
    <aside
      class="w-64 flex flex-col"
      :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
    >
      <div
        class="h-14 flex items-center px-6 font-bold border-b dark:border-b-slate-600 border-b-slate-200"
      >
        Nimbus
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1">
        <template v-if="menus.length > 0">
          <NavItem
            v-for="menu in menus"
            :key="menu.route"
            :label="menu.label"
            :to="menu.route"
          />
        </template>
        <div v-else class="px-3 py-2 text-sm text-slate-400 italic">
          No accessible menu
        </div>
      </nav>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">
      <header
        class="h-14 border-b dark:border-b-slate-600 border-b-slate-200 flex items-center justify-between px-6"
        :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
      >
        <h1 class="font-semibold">{{ title }}</h1>

        <div class="flex items-center gap-3">
          <ThemeToggle />
          <Dropdown :items="dropdownItems" @select="onSelect">
            <template #trigger>
              <div class="h-8 w-8 rounded-full bg-slate-400" />
            </template>
          </Dropdown>
        </div>
      </header>

      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>