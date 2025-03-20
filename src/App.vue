<template>
  <div class="h-screen flex">
    <Sidebar v-if="authLoaded && authStore.token" />
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import Sidebar from '@/components/Sidebar.vue'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const authLoaded = ref(false) //Estado para saber si la autenticación ya se verificó

onMounted(() => {
  setTimeout(() => {
    authLoaded.value = true //Esperar para evitar parpadeos
  }, 500)
})
</script>
