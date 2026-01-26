<script setup lang="ts">
import Button from "../../../components/ui/Button.vue";
import AppLayout from "../../../layouts/AppLayout.vue";
</script>

<template>
  <AppLayout title="Create User">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Create User</h1>
        <p class="text-sm text-gray-500">
          Add a new user and assign their role
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <form class="p-6 space-y-6">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="john@email.com"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="john.doe"
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <!-- Password -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option disabled selected>Select role</option>
              <option>Admin</option>
              <option>Manager</option>
              <option>User</option>
            </select>
          </div>

          <!-- Status -->
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700">Active Status</p>
              <p class="text-xs text-gray-500">Disable to prevent user login</p>
            </div>
            <input type="checkbox" class="toggle toggle-primary" checked />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <Button @click="$router.go(-1)">Cancel</Button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>
