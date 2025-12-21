<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-disabled="disabled"
    :class="classes"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
    type: "button",
  }
);

const base =
  "inline-flex items-center justify-center rounded-lg font-medium transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 " +
  "focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  secondary:
    "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

const classes = computed(() => [
  base,
  variants[props.variant],
  sizes[props.size],
]);
</script>
