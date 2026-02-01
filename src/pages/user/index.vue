<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "../../layouts/AppLayout.vue";
import Button from "../../components/ui/Button.vue";
import Badge from "../../components/ui/Badge.vue";
import TableSkeleton from "../../components/ui/TableSkeleton.vue";
import { useCan } from "../../features/authentication/useCan";
import { useUsersStore } from "../../stores/users";
import { format } from "../../util/format";

const { ucWords } = format();

const store = useUsersStore();
const { users, loading, error, page, totalPages } = storeToRefs(store);
const { fetchUsers } = store;

const { can } = useCan();

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
          <h2 class="text-lg font-semibold">
            Users
          </h2>
          <p
            class="text-sm"
            :style="{ color: 'rgb(var(--color-muted))' }"
          >
            Manage access users and the role for users
          </p>
        </div>
        <Button
          :disabled="!can('users.create')"
          @click="$router.push('users/create')"
        >
          Create Users
        </Button>
        <p
          v-if="!can('users.create')"
          class="text-xs text-slate-400 mt-1"
        >
          You don’t have permission to perform this action
        </p>
      </div>

      <!-- Loading -->
      <TableSkeleton v-if="loading" />

      <!-- Error -->
      <div
        v-else-if="error"
        class="p-10 text-center text-red-600"
      >
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
                <th
                  scope="col"
                  class="px-6 py-3 text-left"
                >
                  Name
                </th>
                <th class="px-6 py-3 text-left">
                  Email
                </th>
                <th class="px-6 py-3 text-left">
                  Role
                </th>
                <th class="px-6 py-3 text-left">
                  Status
                </th>
                <th class="px-6 py-3 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                v-memo="[user.id, user.active]"
                tabindex="0"
                aria-label="User row"
                class="border-t dark:border-t-slate-600 border-t-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <td
                  scope="row"
                  class="px-6 py-3"
                >
                  {{ user.name }}
                </td>
                <td class="px-6 py-3 text-slate-600 dark:text-slate-200">
                  {{ user.email }}
                </td>
                <td class="px-6 py-3">
                  {{ ucWords(user.roles[0]?.name || "") }}
                </td>
                <td class="px-6 py-3">
                  <Badge :tone="user.status == 'active' ? 'success' : 'error'">
                    {{ ucWords(user.status) }}
                  </Badge>
                </td>
                <td class="px-6 py-3 text-right space-x-2">
                  <Button
                    v-if="can('users.update')"
                    size="sm"
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    v-if="can('users.delete')"
                    size="sm"
                    variant="danger"
                  >
                    Delete
                  </Button>
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
              aria-label="Previous Page"
              @click="page--"
            >
              Prev
            </Button>

            <Button
              size="sm"
              variant="secondary"
              :disabled="page === totalPages"
              aria-label="Next Page"
              @click="page++"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
