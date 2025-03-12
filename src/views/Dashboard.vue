<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
        🎉 Bienvenido al Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-center mt-2">
        Has iniciado sesión correctamente en <span class="text-yellow-500">MesaYa</span>.
      </p>

      <div class="mt-6 flex flex-col items-center">
        <p class="text-lg text-gray-700 dark:text-gray-300">
          Usuario: <span class="font-semibold">{{ user?.email || 'Desconocido' }}</span>
        </p>
        <p class="text-lg text-gray-700 dark:text-gray-300 mt-2">
          Rol: <span class="font-semibold">{{ user?.role || 'No definido' }}</span>
        </p>
      </div>

      <div class="mt-6 flex justify-center space-x-4">
        <button
          @click="logout"
          class="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
