<script setup lang="ts">
import Button from "../../../components/ui/Button.vue";
import Input from "../../../components/ui/Input.vue";
import AppLayout from "../../../layouts/AppLayout.vue";
import { useCreateUserStore } from "../../../stores/users/create";
import { computed, reactive, ref, watch } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

interface Role {
  id: string;
  name: string;
}

const createUserStore = useCreateUserStore() as any;

const query = ref("");
const selectedRole = ref<Role | null>(null);
const fetched = ref(false);
const opened = ref(false);

const router = useRouter();

// Reactive form values for real-time validation
const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  isActive: true
});

// Initialize formData with store values
Object.assign(formData, createUserStore.form);

// Sync store with form data only when needed (not continuously)
const syncToStore = () => {
  Object.assign(createUserStore.form, formData);
};

// debounce
let searchTimeout: number | null = null;

watch(query, (keyword) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = window.setTimeout(() => {
    createUserStore.searchRoles(keyword);
  }, 300);
});

// sync role selection to formData
watch(selectedRole, (role) => {
  formData.role = role?.id || "";
});

const handleFocus = async () => {
  opened.value = true

  if (!fetched.value) {
    fetched.value = true
    await createUserStore.searchRoles("")
  }
}

const filteredRoles = computed(() => {
  if (!query.value) return createUserStore.roles
  return createUserStore.roles.filter((r: Role) =>
    r.name.toLowerCase().includes(query.value.toLowerCase())
  )
})

// Error states - using individual refs for maximum reactivity
const fullNameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const roleError = ref('');

// Sync form data with store
watch(formData, (newData) => {
  createUserStore.form = { ...newData };
}, { deep: true });

// Sync store errors to local refs for display
watch(() => createUserStore.validationErrors, (errors) => {
  fullNameError.value = errors.fullName || '';
  emailError.value = errors.email || '';
  passwordError.value = errors.password || '';
  confirmPasswordError.value = errors.confirmPassword || '';
  roleError.value = errors.role || '';
}, { immediate: true });

watch(() => createUserStore.error, (newError) => {
  if (newError) {
    toast.error(newError);
  }
});

const handleSubmit = async () => {
  // Sync formData to store before submitting
  syncToStore();
  
  try {
    const result = await createUserStore.createUser();
    // Success, maybe redirect or show toast
    if (result.success) {
      createUserStore.resetForm();
      toast.success("User created successfully!");
      router.push('/users');
      // Re-sync after reset
      Object.assign(formData, createUserStore.form);
    }
  } catch {
    // Error handled in store
  }
};
</script>

<template>
  <AppLayout title="Create User">
    <div class="max-w mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">
          Create User
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-300">
          Add a new user and assign their role
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
            v-model="formData.fullName"
            label="Full Name"
            type="text"
            :error="fullNameError"
            @focus="createUserStore.setTouched('fullName')"
          />

          <!-- Email -->
          <Input
            v-model="formData.email"
            label="Email"
            type="email"
            :error="emailError"
            @focus="createUserStore.setTouched('email')"
          />

          <!-- Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="formData.password"
              label="Password"
              type="password"
              :error="passwordError"
              @focus="createUserStore.setTouched('password')"
            />
            <Input
              v-model="formData.confirmPassword"
              label="Confirm Password"
              type="password"
              :error="confirmPasswordError"
              @focus="createUserStore.setTouched('confirmPassword')"
            />
          </div>

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
                  v-if="createUserStore.loading"
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
              v-model="formData.isActive"
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
                createUserStore.loading || !createUserStore.isFormValid
              "
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {{ createUserStore.loading ? "Creating..." : "Create User" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>
