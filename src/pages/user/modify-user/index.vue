<script setup lang="ts">
import Button from "../../../components/ui/Button.vue";
import Input from "../../../components/ui/Input.vue";
import AppLayout from "../../../layouts/AppLayout.vue";
import { useModifyUserStore } from "../../../stores/users/modify";
import { computed, reactive, ref, watch, onMounted } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import router from "../../../router";

interface Role {
  id: string;
  name: string;
}

const modifyUserStore = useModifyUserStore() as any;

const query = ref("");
const selectedRole = ref<Role | null>(null);
const fetched = ref(false);
const opened = ref(false);

const route = useRoute();

// Get user_id from route params
const userId = route.params.id as string;

// Reactive form values for real-time validation
const formData = reactive({
  id: '',
  name: '',
  email: '',
  role_id: '',
  status: true,
});

// Initialize formData with store values
Object.assign(formData, modifyUserStore.form);

// Sync store with form data only when needed (not continuously)
const syncToStore = () => {
  Object.assign(modifyUserStore.form, formData);
};

// debounce
let searchTimeout: number | null = null;

watch(query, (keyword) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = window.setTimeout(() => {
    modifyUserStore.searchRoles(keyword);
  }, 300);
});

// sync role selection to formData
watch(selectedRole, (role) => {
  formData.role_id = role?.id || "";
});

const handleFocus = async () => {
  opened.value = true

  if (!fetched.value) {
    fetched.value = true
    await modifyUserStore.searchRoles("")
  }
}

const filteredRoles = computed(() => {
  if (!query.value) return modifyUserStore.roles
  return modifyUserStore.roles.filter((r: Role) =>
    r.name.toLowerCase().includes(query.value.toLowerCase())
  )
})

// Error states - using individual refs for maximum reactivity
const fullNameError = ref('');
const emailError = ref('');
const roleError = ref('');

// Sync form data with store
watch(formData, (newData) => {
  modifyUserStore.form = { ...newData };
}, { deep: true });

// Sync store errors to local refs for display
watch(() => modifyUserStore.validationErrors, (errors) => {
  fullNameError.value = errors.fullName || '';
  emailError.value = errors.email || '';
  roleError.value = errors.role || '';
}, { immediate: true });

watch(() => modifyUserStore.error, (newError) => {
  if (newError) {
    toast.error(newError);
  }
});

// Fetch user detail on mount
onMounted(async () => {
  if (userId) {
    await modifyUserStore.fetchUserDetail(userId);


    formData.id = userId;
    formData.name = modifyUserStore.user?.name || "";
    formData.email = modifyUserStore.user?.email || "";
    formData.status = modifyUserStore.user?.status == 'active';

    // Set selectedRole based on user data
    if (modifyUserStore.user?.roles?.[0]) {
      selectedRole.value = {
        id: modifyUserStore.user.roles[0].id,
        name: modifyUserStore.user.roles[0].name
      };
    }
  }
});

const handleSubmit = async () => {
  syncToStore();
  
  try {
    const result = await modifyUserStore.updateUser(userId);
    if (result.success) {
      toast.success("User updated successfully!");
      router.push('/users');
    }
  } catch {
    // Error handled in store
  }
};
</script>

<template>
  <AppLayout title="Modify User">
    <div class="max-w mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
          Modify User
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-300">
          Update user information and role assignment
        </p>
      </div>

      <!-- Card -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
      >
        <form
          class="p-6 space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- Full Name -->
          <Input
            v-model="formData.name"
            label="Full Name"
            type="text"
            :error="fullNameError"
            @focus="modifyUserStore.setTouched('fullName')"
          />

          <!-- Email -->
          <Input
            v-model="formData.email"
            label="Email"
            type="email"
            :error="emailError"
            @focus="modifyUserStore.setTouched('email')"
          />

          <!-- Role -->
          <Combobox
            v-model="selectedRole"
            nullable
            by="id"
          >
            <div class="relative">
              <ComboboxLabel
                class="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Role
              </ComboboxLabel>
              <ComboboxInput
                class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :display-value="(item: any) => item?.name ?? ''"
                @focus="handleFocus"
                @input="query = $event.target.value"
              />

              <!-- ⬇️ PAKSA MUNCUL -->
              <ComboboxOptions
                v-show="opened"
                static
                class="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div
                  v-if="modifyUserStore.loadingRoles"
                  class="px-3 py-2 text-sm text-gray-500"
                >
                  Loading...
                </div>

                <ComboboxOption
                  v-for="role in filteredRoles"
                  :key="role.id"
                  :value="role"
                  class="
                    cursor-pointer px-3 py-2
                    text-gray-900 dark:text-gray-100
                    hover:bg-indigo-600 hover:text-white
                    dark:hover:bg-indigo-500
                    transition-colors
                  "
                  @click="opened = false"
                >
                  {{ role.name }}
                </ComboboxOption>
              </ComboboxOptions>
            </div>
            <div
              v-if="roleError"
              class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {{ roleError }}
            </div>
          </Combobox>

          <!-- Status -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Status
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Disable to prevent user login
              </p>
            </div>
            <input
              v-model="formData.status"
              type="checkbox"
              class="toggle toggle-primary"
            >
          </div>

          <!-- Actions -->
          <div
            class="flex justify-end gap-3 pt-4 border-t border-slate-300 dark:border-slate-600"
          >
            <Button @click="$router.go(-1)">
              Cancel
            </Button>
            <button
              type="submit"
              :disabled="
                modifyUserStore.loading || modifyUserStore.loadingDetail || !modifyUserStore.isFormValid
              "
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {{ modifyUserStore.loading ? "Updating..." : "Update User" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>
