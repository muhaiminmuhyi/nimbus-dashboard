<script setup lang="ts">
import { usePermissions } from "../../../features/permissions/usePermissions";

const { roles, modules, permissions } = usePermissions();
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        Permissions
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
            <th v-for="role in roles" :key="role" class="px-6 py-3 text-center">
              {{ role }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="module in modules"
            :key="module.key"
            class="border-t dark:border-t-slate-600 border-t-slate-200"
          >
            <td class="px-6 py-4 font-medium">
              {{ module.label }}
            </td>

            <td v-for="role in roles" :key="role" class="px-6 py-4 text-center">
              <input
                v-model="permissions[role][module.key]"
                type="checkbox"
                class="h-4 w-4"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Debug preview -->
    <pre class="text-xs bg-slate-900 text-slate-100 p-4 rounded-lg"
      >{{ permissions }}
    </pre>
  </div>
</template>
