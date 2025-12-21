<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
import { usePermissions } from '../features/permissions/usePermissions'

const { roles, modules, permissions } = usePermissions()
</script>

<template>
  <AppLayout title="Settings">
    <div class="space-y-6">
      <div>
        <h2 class="text-lg font-semibold">Permissions</h2>
        <p class="text-sm" :style="{ color: 'rgb(var(--color-muted))' }">
          Manage role-based access control
        </p>
      </div>

      <div
        class="rounded-lg shadow-sm overflow-x-auto"
        :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
      >
        <table class="w-full text-sm">
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th class="px-6 py-3 text-left">Module</th>
              <th
                v-for="role in roles"
                :key="role"
                class="px-6 py-3 text-center"
              >
                {{ role }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="module in modules"
              :key="module.key"
              class="border-t dark:border-t-slate-600"
            >
              <td class="px-6 py-4 font-medium">
                {{ module.label }}
              </td>

              <td
                v-for="role in roles"
                :key="role"
                class="px-6 py-4 text-center"
              >
                <input
                  type="checkbox"
                  v-model="permissions[role][module.key]"
                  class="h-4 w-4"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Debug preview -->
      <pre class="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg">
{{ permissions }}
      </pre>
    </div>
  </AppLayout>
</template>