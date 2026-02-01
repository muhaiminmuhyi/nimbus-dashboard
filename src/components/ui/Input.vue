<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <div
      v-if="error"
      class="text-red-500 text-sm mt-1"
    >
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: string;
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>