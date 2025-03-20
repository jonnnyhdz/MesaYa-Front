<template>
  <div class="relative min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-600 opacity-40"></div>
    <div
      class="relative bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-xl shadow-lg rounded-3xl p-10 w-full max-w-md transition-all duration-500"
    >
      <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
        Bienvenido a <span class="text-yellow-500">MesaYa</span>
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-center mt-2">Inicia sesión para continuar</p>
      <form @submit.prevent="login" class="mt-6 space-y-4">
        <div class="relative">
          <input
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
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
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
          :disabled="loading"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else>Iniciar Sesión</span>
        </button>
      </form>
      <p v-if="errorMessage" class="text-red-500 text-center mt-2">{{ errorMessage }}</p>
      <div class="flex justify-between items-center mt-4">
        <a href="#" class="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
        <router-link to="/register" class="text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >Crear una cuenta</router-link
        >
      </div>
      <div class="mt-6 flex items-center justify-center space-x-3">
        <span class="h-px w-16 bg-gray-400"></span>
        <span class="text-gray-500 dark:text-gray-400 text-sm">O continúa con</span>
        <span class="h-px w-16 bg-gray-400"></span>
      </div>
      <div class="flex justify-center mt-4">
        <button
          class="p-3 bg-white dark:bg-gray-700 shadow-md rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
          @click="googleLogin"
        >
          <i class="fab fa-google text-red-500 text-lg"></i>
        </button>
      </div>
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
import { signInWithGoogle } from '@/firebaseConfig'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const login = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await authStore.login(email.value, password.value)
    const role = authStore.role
    if (role === 'Admin') {
      router.push('/dashboard-admin')
    } else if (role === 'Usuario') {
      router.push('/dashboard-usuario')
    } else if (role === 'Hostess') {
      router.push('/dashboard-hostess')
    } else {
      router.push('/')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

const googleLogin = async () => {
  try {
    const user = await signInWithGoogle()
    console.log('Usuario autenticado:', user)
    if (user?.email) {
      router.push('/dashboard-usuario')
    } else {
      errorMessage.value = 'Error: No se pudo obtener la cuenta de Google'
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión con Google'
    console.error('Google Login Error:', error)
  }
}

const goToHome = () => {
  router.push('/')
}
</script>
