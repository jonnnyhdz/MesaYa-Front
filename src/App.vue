<template>
  <div class="h-screen flex">
    <template
      v-if="
        authLoaded &&
        authStore.token &&
        (authStore.role === 'Admin' || authStore.role === 'Hostess')
      "
    >
      <Sidebar :is-expanded.sync="isSidebarExpanded" />
      <div
        class="flex-1 transition-all duration-300"
        :style="{ marginLeft: isSidebarExpanded ? '0px' : '60px' }"
      >
        <router-view />
      </div>
    </template>

    <template v-else-if="authLoaded && authStore.token && authStore.role === 'Usuario'">
      <div class="w-full">
        <Navbar />
        <div class="pt-24 px-4">
          <router-view />
        </div>
      </div>
    </template>

    <template v-else-if="authLoaded">
      <div class="w-full">
        <router-view />
      </div>
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import { ref, onMounted } from 'vue'

const authStore = useAuthStore()
const authLoaded = ref(false)
const isSidebarExpanded = ref(true)

onMounted(() => {
  setTimeout(() => {
    authLoaded.value = true
  }, 500)
})
</script>
