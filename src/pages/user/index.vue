<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import AppLayout from "../../layouts/AppLayout.vue";
import Button from "../../components/ui/Button.vue";
import Badge from "../../components/ui/Badge.vue";
import TableSkeleton from "../../components/ui/TableSkeleton.vue";
import { useCan } from "../../features/authentication/useCan";
import { useUsersStore } from "../../stores/users";
import { format } from "../../util/format";
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import type { User } from "../../types/user";
import { toast } from "vue-sonner";

const { ucWords } = format();

const store = useUsersStore();
const { users, loading, error, page, totalPages } = storeToRefs(store);
const { fetchUsers } = store;

const { can } = useCan();

// Dialog state
const showDeleteDialog = ref(false);
const userToDelete = ref<User | null>(null);

onMounted(() => {
  fetchUsers();
});

// Dialog functions
const openDeleteDialog = (user: User) => {
  userToDelete.value = user;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  userToDelete.value = null;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  try {
    await store.deleteUser(userToDelete.value.id);
    toast.success('User deleted successfully');
    closeDeleteDialog();
    // Optionally refetch users or show success message
    await fetchUsers();
  } catch (error: unknown) {
    // Show user-friendly error message from interceptor
    const axiosError = error as { userFriendlyMessage?: string; response?: { data?: { message?: string } } };
    const errorMessage = axiosError.userFriendlyMessage || axiosError.response?.data?.message || 'Failed to delete user';
    // For now, we'll just log it. You can integrate with your toast system
    toast.error(errorMessage);
  }
};
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
                v-memo="[user.id, user.status]"
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </Button>
                  <Button 
                    v-if="can('users.delete')" 
                    size="sm" 
                    variant="danger"
                    @click="openDeleteDialog(user)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
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

    <!-- Delete Confirmation Dialog -->
    <Dialog
      :open="showDeleteDialog"
      class="relative z-50"
    >
      <div
        class="fixed inset-0 bg-black/70"
        aria-hidden="true"
      />
      
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
          <DialogTitle class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Delete User
          </DialogTitle>
          
          <DialogDescription class="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete <strong>{{ userToDelete?.name }}</strong>? 
            This action cannot be undone.
          </DialogDescription>
          
          <div class="flex justify-end gap-3">
            <Button 
              variant="secondary" 
              size="sm"
              @click="closeDeleteDialog"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              @click="confirmDelete"
            >
              Delete
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  </AppLayout>
</template>
