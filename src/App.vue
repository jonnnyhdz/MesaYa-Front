<template>
  <div class="h-screen flex">
    <!-- 📌 Sidebar solo si el usuario está autenticado -->
    <Sidebar v-if="authStore.token" />

    <!-- 📌 Contenido principal -->
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import Sidebar from '@/components/Sidebar.vue'

const authStore = useAuthStore()
</script>
