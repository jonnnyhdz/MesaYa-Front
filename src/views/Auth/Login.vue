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

      <Form @submit="handleSubmit" :validation-schema="schema" class="mt-6 space-y-4">
        <!-- Email -->
        <div class="relative">
          <Field
            name="email"
            type="email"
            placeholder="Correo electrónico"
            class="w-full px-5 py-3 rounded-full border bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          <i class="fas fa-envelope absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
        </div>

        <!-- Contraseña -->
        <div class="relative">
          <Field
            :type="showPassword ? 'text' : 'password'"
            name="password"
            placeholder="Contraseña"
            class="w-full px-5 py-3 rounded-full border bg-gray-50 dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
          <i
            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="absolute right-5 top-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-blue-500"
            @click="togglePassword"
          ></i>
        </div>

        <!-- Botón -->
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
          :disabled="loading || isBlocked"
        >
          <span v-if="loading">Cargando...</span>
          <span v-else-if="isBlocked && !blockMessageShown"
            >Demasiados intentos. Espera {{ timeLeft }}s</span
          >
          <span v-else-if="blockMessageShown">Ya puedes intentar iniciar sesión nuevamente</span>
          <span v-else>Iniciar Sesión</span>
        </button>
        <RecaptchaV2 class="pl-8" :sitekey=recaptchaKey ref="recaptcha" @load-callback="captcha"/>
      </Form>

      <p v-if="errorMessage" class="text-red-500 text-center mt-2">{{ errorMessage }}</p>

      <div class="flex justify-between items-center mt-4">
        <a href="#" class="text-sm text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
        <router-link
          to="/register"
          class="text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          Crear una cuenta
        </router-link>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { signInWithGoogle } from '@/firebaseConfig'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import DOMPurify from 'dompurify'
import { RecaptchaV2 } from "vue3-recaptcha-v2";

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const loginAttempts = ref(parseInt(localStorage.getItem('loginAttempts')) || 0)
const blockUntil = ref(parseInt(localStorage.getItem('blockUntil')) || null)
const blockLevel = ref(parseInt(localStorage.getItem('blockLevel')) || 0)
const timeLeft = ref(0)
const blockMessageShown = ref(false)
const isBlocked = ref(false)
const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY // Obtiene la clave pública
const recaptchaToken = ref()

const captcha = (resCaptcha) => {
  console.log("Token de reCAPTCHA obtenido:", resCaptcha);
      recaptchaToken.value = resCaptcha; // Guarda el token
      
}

// Esquema de validación con sanitización
const schema = yup.object({
  email: yup
    .string()
    .email('Correo inválido')
    .required('Correo es obligatorio')
    .test('xss-check', 'Entrada inválida', (value) => value === DOMPurify.sanitize(value)),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .required('Contraseña requerida')
    .test('xss-check', 'Entrada inválida', (value) => value === DOMPurify.sanitize(value)),
})

// Alternar visibilidad de la contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Manejar envío de formulario
const handleSubmit = async (values) => {
  errorMessage.value = ''
  loading.value = true

  const email = DOMPurify.sanitize(values.email)
  const password = DOMPurify.sanitize(values.password)

  try {
    await authStore.login(email, password, recaptchaToken.value)

    // Éxito: reiniciar datos
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('blockUntil')
    localStorage.removeItem('blockLevel')
    loginAttempts.value = 0
    blockLevel.value = 0
    blockUntil.value = null

    const role = authStore.role
    router.push(
      role === 'Admin'
        ? '/dashboard-admin'
        : role === 'Hostess'
          ? '/dashboard-hostess'
          : '/dashboard-usuario',
    )
  } catch (error) {
    loginAttempts.value++
    localStorage.setItem('loginAttempts', loginAttempts.value)

    if (loginAttempts.value >= 3) {
      blockLevel.value++
      localStorage.setItem('blockLevel', blockLevel.value)

      // Duraciones progresivas (segundos)
      const blockDurations = [30, 60, 300, 600]
      const duration = blockDurations[Math.min(blockLevel.value - 1, blockDurations.length - 1)]

      const blockTime = Date.now() + duration * 1000
      blockUntil.value = blockTime
      localStorage.setItem('blockUntil', blockTime)

      updateBlockState()
    }

    errorMessage.value = 'Credenciales incorrectas o error al iniciar sesión'
  } finally {
    loading.value = false
  }
}

// Actualizar el estado del bloqueo
const updateBlockState = () => {
  if (!blockUntil.value) return

  const remaining = Math.floor((blockUntil.value - Date.now()) / 1000)
  timeLeft.value = remaining > 0 ? remaining : 0
  isBlocked.value = remaining > 0

  if (remaining <= 0) {
    blockMessageShown.value = true
    isBlocked.value = false
    loginAttempts.value = 0
    localStorage.removeItem('loginAttempts')
    localStorage.removeItem('blockUntil')

    setTimeout(() => {
      blockMessageShown.value = false
    }, 5000)
  } else {
    setTimeout(updateBlockState, 1000)
  }
}

// Login con Google
const googleLogin = async () => {
  try {
    const user = await signInWithGoogle()
    if (user?.email) {
      router.push('/dashboard-usuario')
    } else {
      errorMessage.value = 'No se pudo obtener la cuenta de Google'
    }
  } catch (error) {
    errorMessage.value = 'Error al iniciar sesión con Google'
    console.error('Google Login Error:', error)
  }
}

// Volver al home
const goToHome = () => {
  router.push('/')
}

// Verificar bloqueo al montar
onMounted(() => {
  if (blockUntil.value) updateBlockState()
  const script = document.createElement('script');
  script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaKey}`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
})
</script>
