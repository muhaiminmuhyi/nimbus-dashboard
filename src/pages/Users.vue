<script setup lang="ts">
import { onMounted } from "vue";
import AppLayout from "../layouts/AppLayout.vue";
import Button from "../components/ui/Button.vue";
import Badge from "../components/ui/Badge.vue";
import TableSkeleton from "../components/ui/TableSkeleton.vue";
import { useUsers } from "../features/users/useUsers";

const {
  users,
  loading,
  error,
  page,
  paginatedUsers,
  totalPages,
  fetchUsers,
} = useUsers();

onMounted(() => {
  fetchUsers();
});
</script>
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

      <!-- Loading -->
      <TableSkeleton v-if="loading" />

      <!-- Error -->
      <div v-else-if="error" class="p-10 text-center text-red-600">
        {{ error }}
      </div>

      <!-- Users Table -->
      <div
        v-else
        class="rounded-lg shadow-sm overflow-hidden"
        :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
      >
        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left">Name</th>
                <th class="px-6 py-3 text-left">Email</th>
                <th class="px-6 py-3 text-left">Role</th>
                <th class="px-6 py-3 text-left">Status</th>
                <th class="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr
                tabindex="0"
                aria-label="User row"
                v-for="user in paginatedUsers"
                :key="user.id"
                v-memo="[user.id, user.active]"
                class="border-t dark:border-t-slate-600 border-t-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td scope="row" class="px-6 py-3">{{ user.name }}</td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-200">
                  {{ user.email }}
                </td>
                <td class="px-6 py-3">{{ user.role }}</td>
                <td class="px-6 py-3">
                  <Badge :tone="user.active ? 'success' : 'error'">
                    {{ user.active ? "Active" : "Disabled" }}
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
                    <p
                      class="text-sm"
                      :style="{ color: 'rgb(var(--color-muted))' }"
                    >
                      No users found
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex items-center justify-between px-6 py-4 border-t dark:border-t-slate-600 border-t-slate-200 text-sm"
        >
          <span> Page {{ page }} of {{ totalPages }} </span>

          <div class="space-x-2">
            <Button
              size="sm"
              variant="secondary"
              :disabled="page === 1"
              @click="page--"
              aria-label="Previous Page"
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="secondary"
              :disabled="page === totalPages"
              @click="page++"
              aria-label="Next Page"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
