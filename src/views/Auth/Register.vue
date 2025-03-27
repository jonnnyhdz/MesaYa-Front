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
        <!-- Nombre -->
        <div class="relative">
          <input
            v-model="userData.name"
            type="text"
            placeholder="Nombre completo"
            @input="sanitize('name')"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            :class="{ 'border-red-500': v$.userData.name.$error }"
          />
          <i class="fas fa-user absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
          <span v-if="v$.userData.name.$error" class="text-red-500 text-sm block mt-1">
            {{ getErrorMessage('name') }}
          </span>
        </div>

        <!-- Email -->
        <div class="relative">
          <input
            v-model="userData.email"
            type="email"
            placeholder="Correo electrónico"
            @input="sanitize('email')"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            :class="{ 'border-red-500': v$.userData.email.$error }"
          />
          <i class="fas fa-envelope absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
          <span v-if="v$.userData.email.$error" class="text-red-500 text-sm block mt-1">
            {{ getErrorMessage('email') }}
          </span>
        </div>

        <!-- Contraseña -->
        <div class="relative">
          <input
            v-model="userData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            @input="sanitize('password'); updatePasswordStrength()"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            :class="{ 'border-red-500': v$.userData.password.$error }"
          />
          <i
            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="absolute right-5 top-4 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-blue-500"
            @click="togglePassword"
          ></i>
          <span v-if="v$.userData.password.$error" class="text-red-500 text-sm block mt-1">
            {{ getErrorMessage('password') }}
          </span>
        </div>

        <!-- Barra de fortaleza -->
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            class="h-2.5 rounded-full transition-all duration-300"
            :class="passwordStrengthClass"
            :style="{ width: passwordStrength + '%' }"
          ></div>
        </div>

        <!-- Botón de registro -->
        <button
          type="submit"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-105"
          :disabled="isBlocked"
        >
          <span v-if="isBlocked">Demasiados intentos. Espera {{ timeLeft }}s</span>
          <span v-else>Registrarse</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email as emailValidator } from '@vuelidate/validators'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'

const router = useRouter()
const authStore = useAuthStore()

const userData = ref({ name: '', email: '', password: '' })
const showPassword = ref(false)
const passwordStrength = ref(0)

const registerAttempts = ref(parseInt(localStorage.getItem('registerAttempts')) || 0)
const blockUntil = ref(parseInt(localStorage.getItem('registerBlockUntil')) || null)
const isBlocked = ref(false)
const timeLeft = ref(0)

// Validación
const rules = computed(() => ({
  userData: {
    name: { required, minLength: minLength(3), maxLength: maxLength(50) },
    email: { required, email: emailValidator },
    password: { required, minLength: minLength(8), maxLength: maxLength(20) },
  },
}))
const v$ = useVuelidate(rules, { userData })

const validationMessages = {
  required: 'Este campo es obligatorio.',
  minLength: (l) => `Debe contener al menos ${l} caracteres.`,
  maxLength: (l) => `Debe contener máximo ${l} caracteres.`,
  email: 'Debe ser un correo electrónico válido.',
}

const getErrorMessage = (field) => {
  if (!v$.value.userData[field].$error) return ''
  const err = v$.value.userData[field].$errors[0]
  if (err.$validator === 'required') return validationMessages.required
  if (err.$validator === 'minLength') return validationMessages.minLength(err.$params.min)
  if (err.$validator === 'maxLength') return validationMessages.maxLength(err.$params.max)
  if (err.$validator === 'email') return validationMessages.email
  return 'Error desconocido.'
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const updatePasswordStrength = () => {
  const pwd = userData.value.password
  let strength = 0
  if (pwd.length >= 8) strength += 25
  if (/\d/.test(pwd)) strength += 25
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25
  if (/[^a-zA-Z0-9]/.test(pwd)) strength += 25
  passwordStrength.value = strength
}

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'bg-red-500'
  if (passwordStrength.value < 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

// Sanitización para prevenir XSS
const sanitize = (field) => {
  const clean = userData.value[field].replace(/<[^>]*>?/gm, '').trim()
  userData.value[field] = clean
}

const registerUser = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    showErrorAlert('Por favor, completa todos los campos correctamente.')
    return
  }

  try {
    await authStore.register(userData.value.name, userData.value.email, userData.value.password)
    localStorage.removeItem('registerAttempts')
    localStorage.removeItem('registerBlockUntil')
    showSuccessAlert('Registro exitoso')
    setTimeout(() => router.push('/login'), 1500)
  } catch (error) {
    registerAttempts.value++
    localStorage.setItem('registerAttempts', registerAttempts.value)

    if (registerAttempts.value >= 3) {
      const blockTime = Date.now() + 30_000
      blockUntil.value = blockTime
      localStorage.setItem('registerBlockUntil', blockTime)
      updateBlockState()
    }

    showErrorAlert('Error al registrarse. Intenta más tarde.')
    console.error('Error:', error)
  }
}

const updateBlockState = () => {
  if (!blockUntil.value) return
  const remaining = Math.floor((blockUntil.value - Date.now()) / 1000)
  timeLeft.value = remaining > 0 ? remaining : 0
  isBlocked.value = remaining > 0

  if (remaining <= 0) {
    isBlocked.value = false
    registerAttempts.value = 0
    localStorage.removeItem('registerAttempts')
    localStorage.removeItem('registerBlockUntil')
  } else {
    setTimeout(updateBlockState, 1000)
  }
}

const goToHome = () => router.push('/')

onMounted(() => {
  if (blockUntil.value) updateBlockState()
})
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444;
}
</style>
