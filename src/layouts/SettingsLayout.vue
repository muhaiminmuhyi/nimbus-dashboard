<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

interface Tab {
  name: string;
  path: string;
}

const route = useRoute();
const router = useRouter();

const tabs: Tab[] = [
  { name: "Roles", path: "/settings/roles" },
  // { name: "API Keys", path: "/settings/api-keys" },
  // { name: "Notifications", path: "/settings/notifications" },
];

const activeTab = computed(() => route.path);

// Redirect to permissions if on base settings route
onMounted(() => {
  if (
    route.path.startsWith("/settings") &&
    !tabs.some((t) => route.path.startsWith(t.path))
  ) {
    router.replace("/settings/roles");
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Settings
      </h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Manage your account settings and preferences.
      </p>
    </div>

    <!-- Tabs Navigation -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <router-link
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          :class="[
            activeTab.startsWith(tab.path)
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          {{ tab.name }}
        </router-link>
      </nav>
    </div>

    <!-- Content Area -->
    <div>
      <router-view />
    </div>
  </div>
</template>
