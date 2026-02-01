<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  items: {
    type: Array,
    required: true,
    // { key, label, danger? }
  },
});

const emit = defineEmits(["select"]);

const open = ref(false);
const wrapper = ref(null);

const toggle = () => {
  open.value = !open.value;
};

const close = () => {
  open.value = false;
};

const select = (item) => {
  emit("select", item);
  close();
};

const handleClickOutside = (e) => {
  if (wrapper.value && !wrapper.value.contains(e.target)) {
    close();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div
    ref="wrapper"
    class="relative inline-block"
  >
    <!-- Trigger -->
    <div @click="toggle">
      <slot name="trigger" />
    </div>

    <!-- Popup -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-3 w-56 rounded-2xl dark:bg-slate-800/80 bg-white backdrop-blur-xl shadow-2xl ring-1 ring-white/10"
      >
        <ul class="">
          <li
            v-for="item in items"
            :key="item.key"
          >
            <button
              class="w-full px-6 py-2.5 text-left dark:text-slate-300 text-slate-600 hover:dark:text-white hover:text-slate-900 hover:dark:bg-white/5 hover:bg-slate-500/5 hover:rounded-2xl transition"
              :class="item.danger && 'text-amber-400 hover:text-red-300 hover:bg-red-500/10'"
              @click="select(item)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
