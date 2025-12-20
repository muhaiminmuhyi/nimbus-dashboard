<template>
  <AppLayout title="Users">
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">Users</h2>
          <p class="text-sm" :style="{ color: 'rgb(var(--color-muted))' }">
            Manage access users and the role for users
          </p>
        </div>
        <Button>Create Users</Button>
      </div>

      <!-- Users Table -->
      <div class="rounded-lg shadow-sm overflow-hidden" :style="{ backgroundColor: 'rgb(var(--color-surface))' }">
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th class="px-6 py-3 text-left">Name</th>
                <th class="px-6 py-3 text-left">Email</th>
                <th class="px-6 py-3 text-left">Role</th>
                <th class="px-6 py-3 text-left">Status</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="border-t dark:border-t-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td class="px-6 py-3">{{ user.name }}</td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-200">{{ user.email }}</td>
                <td class="px-6 py-3">{{ user.role }}</td>
                <td class="px-6 py-3">
                  <Badge
                    :tone="user.active ? 'success' : 'error'"
                  >
                    {{ user.active ? 'Active' : 'Disabled' }}
                  </Badge>
                </td>
                <td class="px-6 py-3 text-right space-x-2">
                  <Button size="sm" variant="secondary">Edit</Button>
                  <Button size="sm" variant="danger">Delete</Button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="5">
                  <div class="p-10 text-center">
                    <p class="text-sm" :style="{ color: 'rgb(var(--color-muted))' }">
                      No users found
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'

const users = [
  {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@nimbus.app',
    role: 'Admin',
    active: true,
  },
  {
    id: 2,
    name: 'John Smith',
    email: 'john@nimbus.app',
    role: 'User',
    active: false,
  },
]
</script>
