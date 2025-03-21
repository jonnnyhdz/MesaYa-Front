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
        <!-- Campo para el nombre completo -->
        <div class="relative">
          <input
            v-model="userData.name"
            type="text"
            placeholder="Nombre completo"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            :class="{ 'border-red-500': v$.userData.name.$error }"
          />
          <i class="fas fa-user absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
          <span v-if="v$.userData.name.$error" class="text-red-500 text-sm block mt-1">
            {{ getErrorMessage('name') }}
          </span>
        </div>

        <!-- Campo para el correo electrónico -->
        <div class="relative">
          <input
            v-model="userData.email"
            type="email"
            placeholder="Correo electrónico"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
            :class="{ 'border-red-500': v$.userData.email.$error }"
          />
          <i class="fas fa-envelope absolute right-5 top-4 text-gray-400 dark:text-gray-500"></i>
          <span v-if="v$.userData.email.$error" class="text-red-500 text-sm block mt-1">
            {{ getErrorMessage('email') }}
          </span>
        </div>

        <!-- Campo para la contraseña -->
        <div class="relative">
          <input
            v-model="userData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            class="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            :class="{ 'border-red-500': v$.userData.password.$error }"
            @input="updatePasswordStrength"
          />
          <i
            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="absolute right-5 top-4 text-gray-400 dark:text-gray-500 cursor-pointer transition-all duration-300 hover:text-blue-500"
            @click="togglePassword"
          ></i>
          <span v-if="v$.userData.password.$error" class="text-red-500 text-sm block mt-1">
            {{ getErrorMessage('password') }}
          </span>
        </div>

        <!-- Barra de progreso de la contraseña -->
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@vuelidate/validators'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils' // Importar SweetAlert2

const userData = ref({
  name: '',
  email: '',
  password: '',
})

const showPassword = ref(false)
const passwordStrength = ref(0) // Porcentaje de fortaleza de la contraseña
const router = useRouter()
const authStore = useAuthStore()

// Reglas de validación
const rules = computed(() => ({
  userData: {
    name: { required, minLength: minLength(3), maxLength: maxLength(50) },
    email: { required, email },
    password: { required, minLength: minLength(8), maxLength: maxLength(20) },
  },
}))

const v$ = useVuelidate(rules, { userData })

// Mensajes de error personalizados
const validationMessages = {
  required: 'Este campo es obligatorio.',
  minLength: (length) => `Debe contener al menos ${length} caracteres.`,
  maxLength: (length) => `Debe contener como máximo ${length} caracteres.`,
  email: 'Debe ser un correo electrónico válido.',
}

// Obtener mensajes de error
const getErrorMessage = (field) => {
  if (!v$.value.userData[field].$error) return ''

  const error = v$.value.userData[field].$errors[0]
  if (error.$validator === 'required') return validationMessages.required
  if (error.$validator === 'minLength') return validationMessages.minLength(error.$params.min)
  if (error.$validator === 'maxLength') return validationMessages.maxLength(error.$params.max)
  if (error.$validator === 'email') return validationMessages.email

  return 'Error desconocido.'
}

// Calcular la fortaleza de la contraseña
const updatePasswordStrength = () => {
  const strength = calculatePasswordStrength(userData.value.password)
  passwordStrength.value = strength
}

// Función para calcular la fortaleza de la contraseña
const calculatePasswordStrength = (password) => {
  let strength = 0

  // Longitud mínima
  if (password.length >= 8) strength += 25

  // Contiene números
  if (/\d/.test(password)) strength += 25

  // Contiene letras mayúsculas y minúsculas
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25

  // Contiene caracteres especiales
  if (/[^a-zA-Z0-9]/.test(password)) strength += 25

  return strength
}

// Clase dinámica para la barra de progreso
const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'bg-red-500'
  if (passwordStrength.value < 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

// Mostrar/ocultar contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Volver al inicio
const goToHome = () => {
  router.push('/')
}

// Registrar usuario
const registerUser = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    showErrorAlert('Por favor, completa todos los campos correctamente.')
    return
  }

  try {
    await authStore.register(userData.value.name, userData.value.email, userData.value.password)
    showSuccessAlert('Registro exitoso')
    setTimeout(() => router.push('/login'), 1500)
  } catch (error) {
    showErrorAlert('Error al registrarse. Verifica tus datos e intenta nuevamente.')
    console.error('Error en registro:', error)
  }
}
</script>

<style scoped>
.border-red-500 {
  border-color: #ef4444;
}
</style>
