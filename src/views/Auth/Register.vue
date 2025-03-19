<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-600 opacity-40"></div>

    <div
      class="relative bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-xl shadow-lg rounded-3xl p-10 w-full max-w-md transition-all duration-500"
    >
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
        Crea tu cuenta en <span class="text-yellow-500">MesaYa</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-center mt-2">
        Regístrate y comienza a reservar
      </p>

      <form @submit.prevent="registerUser" class="mt-6 space-y-4">
        <div class="relative">
          <input
            v-model="name"
            type="text"
            placeholder="Nombre completo"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            required
          />
          <i class="fas fa-user absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
        </div>

        <div class="relative">
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            required
          />
          <i class="fas fa-envelope absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
        </div>

        <div class="relative">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />
          <i
            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="absolute right-5 top-4 text-gray-400 dark:text-gray-500 cursor-pointer transition-all duration-300 hover:text-blue-500"
            @click="togglePassword"
          ></i>
        </div>

        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
        >
          Registrarse
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-green-500 hover:underline">Inicia sesión</router-link>
      </p>

      <button
        @click="goToHome"
        class="mt-6 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <i class="fas fa-arrow-left"></i> Volver al inicio
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const goToHome = () => {
  router.push('/')
}

const registerUser = async () => {
  try {
    await authStore.register(name.value, email.value, password.value)
    alert('Registro exitoso')
    router.push('/login') // Se redirige al login después de registrarse
  } catch (error) {
    alert('Error al registrarse, intenta nuevamente')
    console.error('Error en registro:', error)
  }
}
</script>
