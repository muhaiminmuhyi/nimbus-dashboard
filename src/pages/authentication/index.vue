<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { toast } from "vue-sonner";
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  const html = document.documentElement
  html.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved === 'dark'
  applyTheme(isDark.value)
})

watch(error, (newError) => {
  if (newError) {
    toast.error(newError);
  }
});

const submit = async () => {
  error.value = "";
  loading.value = true;

  try {
    await auth.login({ email: email.value, password: password.value });

    await auth.bootstrap();
    router.push((route.query.redirect as string) || "/");
  } catch (e: any) {
    error.value =
      e?.response?.data?.message || "Invalid email or password";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
    <div class="w-full max-w-sm rounded-xl bg-white dark:bg-slate-800 shadow-lg p-6">
      <!-- Header -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-semibold text-slate-800 dark:text-white">
          Nimbus
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Sign in to your dashboard
        </p>
      </div>

      <!-- Form -->
      <form
        class="space-y-4"
        @submit.prevent="submit"
      >
        <div>
          <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@nimbus.dev"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>

        <div>
          <label class="block text-sm text-slate-600 dark:text-slate-400 mb-1">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2 font-medium transition"
        >
          <span v-if="!loading">Sign In</span>
          <span v-else>Signing in...</span>
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-slate-400">
        © {{ new Date().getFullYear() }} Nimbus Dashboard
      </div>
    </div>
  </div>
</template>
