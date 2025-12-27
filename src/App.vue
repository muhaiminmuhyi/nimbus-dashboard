<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAuthStore } from './stores/auth';

const auth = useAuthStore();
</script>

<template>
    <div v-if="!auth.ready" class="min-h-screen flex items-center justify-center">
        <div class="text-sm text-slate-500 animate-pulse">
        Loading Nimbus...
        </div>
    </div>
    <RouterView v-else />
</template>
