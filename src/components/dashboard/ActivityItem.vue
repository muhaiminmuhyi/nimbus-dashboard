<script setup lang="ts">
import { useRouter } from "vue-router";
import RelativeTime from "../ui/RelativeTime.vue";

const _props = defineProps<{
  message: string;
  time: number;
  link?: string;
  highlight?: boolean;
}>();

const router = useRouter();
</script>

<template>
  <div
    class="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800"
    :class="_props.highlight && 'animate-flash'"
    @click="_props.link && router.push(_props.link)"
  >
    <!-- dot -->
    <div class="mt-1 h-2 w-2 rounded-full bg-slate-400" />

    <div class="flex-1">
      <p class="text-sm">
        {{ _props.message }}
      </p>
      <RelativeTime :time="_props.time" />
    </div>
  </div>
</template>
