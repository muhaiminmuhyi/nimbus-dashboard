<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRolesStore } from "../../../stores/roles";
import { useCan } from "../../../features/authentication/useCan";
import Button from "../../../components/ui/Button.vue";
import Input from "../../../components/ui/Input.vue";
import TableSkeleton from "../../../components/ui/TableSkeleton.vue";
import SlideOver from "../../../components/common/SlideOver.vue";
import RoleForm from "../../../components/setting/roles/RoleForm.vue";
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
import { toast } from "vue-sonner";
import type { Role } from "../../../types/role";

const store = useRolesStore();
const { roles, loading, error, page, totalPages } = storeToRefs(store);
const { can } = useCan();

const search = ref("");
const showDeleteDialog = ref(false);
const roleToDelete = ref<Role | null>(null);

// Form Slide-over state
const showForm = ref(false);
const selectedRoleId = ref<string | null>(null);
const formTitle = ref("Create Role");
const formDescription = ref(
  "Fill in the details below to create a new role and its permissions.",
);

const fetchRoles = () => {
  store.fetchRoles(search.value);
};

onMounted(() => {
  fetchRoles();
});

watch(page, () => {
  fetchRoles();
});

watch(search, () => {
  store.setPage(1);
  fetchRoles();
});

const openDeleteDialog = (role: Role) => {
  roleToDelete.value = role;
  showDeleteDialog.value = true;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  roleToDelete.value = null;
};

const confirmDelete = async () => {
  if (!roleToDelete.value) return;

  const result = await store.deleteRole(roleToDelete.value.id);
  if (result.success) {
    toast.success("Role deleted successfully");
    closeDeleteDialog();
  } else {
    toast.error(result.message || "Failed to delete role");
  }
};

const navigateToCreate = () => {
  selectedRoleId.value = null;
  formTitle.value = "Create Role";
  formDescription.value =
    "Create a new role with custom permissions for your team.";
  showForm.value = true;
};

const navigateToEdit = (role: Role) => {
  selectedRoleId.value = role.id;
  formTitle.value = `Edit Role: ${role.name}`;
  formDescription.value =
    "Modify existing role details and update its associated permissions.";
  showForm.value = true;
};

const onFormSuccess = () => {
  showForm.value = false;
  fetchRoles();
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Actions -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Roles
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure user roles and permissions hierarchies
        </p>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-64">
          <Input v-model="search" placeholder="Search roles..." type="search" />
        </div>
        <Button v-if="can('roles.manage')" @click="navigateToCreate">
          Create Role
        </Button>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm"
    >
      {{ error }}
      <button @click="fetchRoles" class="ml-2 underline font-medium">
        Retry
      </button>
    </div>

    <!-- Loading State -->
    <TableSkeleton v-if="loading && roles.length === 0" />

    <!-- Roles Table -->
    <div
      v-else
      class="rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700"
      :style="{ backgroundColor: 'rgb(var(--color-surface))' }"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead
            class="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-6 py-3 text-left font-medium">Name</th>
              <th scope="col" class="px-6 py-3 text-left font-medium">
                Description
              </th>
              <th scope="col" class="px-6 py-3 text-center font-medium">
                Permissions
              </th>
              <th scope="col" class="px-6 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="role in roles"
              :key="role.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {{ role.name }}
              </td>
              <td
                class="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate"
              >
                {{ role.description || "-" }}
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {{ role.permission_count || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <Button
                  v-if="can('roles.manage')"
                  size="sm"
                  variant="secondary"
                  title="Edit Role"
                  @click="navigateToEdit(role)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </Button>
                <Button
                  v-if="can('roles.manage')"
                  size="sm"
                  variant="danger"
                  title="Delete Role"
                  @click="openDeleteDialog(role)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-4"
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
            <tr v-if="roles.length === 0 && !loading">
              <td
                colspan="4"
                class="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
              >
                No roles found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm"
      >
        <span class="text-gray-700 dark:text-gray-300">
          Page {{ page }} of {{ totalPages }}
        </span>

        <div class="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            :disabled="page === 1"
            @click="store.setPage(page - 1)"
          >
            Prev
          </Button>

          <Button
            size="sm"
            variant="secondary"
            :disabled="page === totalPages"
            @click="store.setPage(page + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      :open="showDeleteDialog"
      @close="closeDeleteDialog"
      class="relative z-50"
    >
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          class="mx-auto max-w-sm rounded-xl bg-white dark:bg-gray-900 p-6 shadow-2xl border border-gray-200 dark:border-gray-800"
        >
          <DialogTitle
            class="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Delete Role
          </DialogTitle>

          <DialogDescription
            class="mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            Are you sure you want to delete the role
            <span class="font-semibold text-gray-900 dark:text-white"
              >"{{ roleToDelete?.name }}"</span
            >? This action cannot be undone and may affect users assigned to
            this role.
          </DialogDescription>

          <div class="mt-6 flex justify-end gap-3">
            <Button variant="secondary" @click="closeDeleteDialog">
              Cancel
            </Button>
            <Button variant="danger" @click="confirmDelete">
              Delete Role
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

    <!-- Role Form Slide-over -->
    <SlideOver
      :open="showForm"
      :title="formTitle"
      :description="formDescription"
      @close="showForm = false"
    >
      <RoleForm
        :role-id="selectedRoleId"
        @success="onFormSuccess"
        @close="showForm = false"
      />
    </SlideOver>
  </div>
</template>
