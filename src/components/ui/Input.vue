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
      v-bind="$attrs"
      class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
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
defineOptions({
  inheritAttrs: false
});

interface Props {
  type?: string;
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  onInput?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'input': [event: Event];
  'focus': [event: FocusEvent];
  'blur': [event: FocusEvent];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
  
  // Call the validation function if provided
  if (props.onInput) {
    props.onInput();
  }
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};
</script>