<script setup lang="ts">
import Button from "../../../components/ui/Button.vue";
import Input from "../../../components/ui/Input.vue";
import AppLayout from "../../../layouts/AppLayout.vue";
import { useCreateUserStore } from "../../../stores/users/create";
import { config } from "../../../config";

const createUserStore = useCreateUserStore() as any;

const handleSubmit = async () => {
  try {
    const result = await createUserStore.createUser();
    // Success, maybe redirect or show toast
    if (result.success) {
      createUserStore.resetForm();
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
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <form
          class="p-6 space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- Full Name -->
          <Input
            v-model="createUserStore.form.fullName"
            label="Full Name"
            type="text"
            :error="createUserStore.validationErrors.fullName"
            @blur="createUserStore.setTouched('fullName')"
          />

          <!-- Email -->
          <Input
            v-model="createUserStore.form.email"
            label="Email"
            type="email"
            :error="createUserStore.validationErrors.email"
            @blur="createUserStore.setTouched('email')"
          />

          <!-- Username -->
          <Input
            v-model="createUserStore.form.username"
            label="Username"
            type="text"
            :error="createUserStore.validationErrors.username"
            @blur="createUserStore.setTouched('username')"
          />

          <!-- Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="createUserStore.form.password"
              label="Password"
              type="password"
              :error="createUserStore.validationErrors.password"
              @blur="createUserStore.setTouched('password')"
            />
            <Input
              v-model="createUserStore.form.confirmPassword"
              label="Confirm Password"
              type="password"
              :error="createUserStore.validationErrors.confirmPassword"
              @blur="createUserStore.setTouched('confirmPassword')"
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              v-model="createUserStore.form.role"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @change="createUserStore.setTouched('role')"
            >
              <option
                disabled
                value=""
              >
                Select role
              </option>
              <option :value="config.USER_ROLES.ADMIN">
                {{ config.USER_ROLES.ADMIN }}
              </option>
              <option :value="config.USER_ROLES.MANAGER">
                {{ config.USER_ROLES.MANAGER }}
              </option>
              <option :value="config.USER_ROLES.USER">
                {{ config.USER_ROLES.USER }}
              </option>
            </select>
            <div
              v-if="createUserStore.validationErrors.role"
              class="text-red-500 text-sm mt-1"
            >
              {{ createUserStore.validationErrors.role }}
            </div>
          </div>

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
              v-model="createUserStore.form.isActive"
              type="checkbox"
              class="toggle toggle-primary"
            >
          </div>

          <!-- Error -->
          <div
            v-if="createUserStore.error"
            class="text-red-500 text-sm"
          >
            {{ createUserStore.error }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t border-slate-300 dark:border-slate-600">
            <Button @click="$router.go(-1)">
              Cancel
            </Button>
            <button
              type="submit"
              :disabled="createUserStore.loading || !createUserStore.isFormValid"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {{ createUserStore.loading ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>
