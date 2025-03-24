<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white italic">Nuevo Usuario</h2>
    </div>

    <div
      class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg animate-fade-in max-w-full mx-auto"
    >
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Campo para el nombre de usuario -->
        <div>
          <input
            v-model="userData.username"
            type="text"
            placeholder="Nombre de usuario"
            class="input"
            :class="{ 'border-red-500': v$.username.$error }"
          />
          <span v-if="v$.username.$error" class="text-red-500 text-sm">{{
            getErrorMessage('username')
          }}</span>
        </div>

        <!-- Campo para el correo electrónico -->
        <div>
          <input
            v-model="userData.email"
            type="email"
            placeholder="Correo electrónico"
            class="input"
            :class="{ 'border-red-500': v$.email.$error }"
          />
          <span v-if="v$.email.$error" class="text-red-500 text-sm">{{
            getErrorMessage('email')
          }}</span>
        </div>

        <!-- Campo para la contraseña -->
        <div>
          <input
            v-model="userData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            class="input"
            :class="{ 'border-red-500': v$.password.$error }"
          />
          <i
            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="absolute right-5 top-4 text-gray-400 dark:text-gray-500 cursor-pointer transition-all duration-300 hover:text-blue-500"
            @click="togglePassword"
          ></i>
          <span v-if="v$.password.$error" class="text-red-500 text-sm">{{
            getErrorMessage('password')
          }}</span>
        </div>

        <!-- Botones de acción -->
        <div class="flex justify-end space-x-3">
          <button @click="goBack" type="button" class="btn-secondary">
            <i class="fas fa-arrow-left mr-2"></i> Cancelar
          </button>
          <button type="submit" class="btn-primary">
            <i class="fas fa-save mr-2"></i> Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@vuelidate/validators'

const userStore = useUserStore()
const router = useRouter()

const userData = ref({
  username: '', // Nombre de usuario
  email: '', // Correo electrónico
  password: '', // Contraseña
})

const showPassword = ref(false)

// Reglas de validación
const rules = computed(() => ({
  username: {
    required,
    minLength: minLength(3),
    maxLength: maxLength(50),
  },
  email: {
    required,
    email,
  },
  password: {
    required,
    minLength: minLength(8),
    maxLength: maxLength(20),
  },
}))

const v$ = useVuelidate(rules, userData)

// Mensajes de error personalizados
const validationMessages = {
  required: 'Este campo es obligatorio.',
  minLength: (length) => `Debe contener al menos ${length} caracteres.`,
  maxLength: (length) => `Debe contener como máximo ${length} caracteres.`,
  email: 'Debe ser un correo electrónico válido.',
}

// Obtener mensajes de error
const getErrorMessage = (field) => {
  if (!v$.value[field].$error) return ''

  const error = v$.value[field].$errors[0]
  if (error.$validator === 'required') return validationMessages.required
  if (error.$validator === 'minLength') return validationMessages.minLength(error.$params.min)
  if (error.$validator === 'maxLength') return validationMessages.maxLength(error.$params.max)
  if (error.$validator === 'email') return validationMessages.email

  return 'Error desconocido.'
}

// Mostrar/ocultar contraseña
const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Volver a la vista anterior
const goBack = () => {
  router.push('/gestionUsers')
}

// Enviar el formulario
const submitForm = async () => {
  // Validar el formulario
  v$.value.$touch()
  if (v$.value.$invalid) {
    showErrorAlert('Por favor, completa todos los campos correctamente.')
    return
  }

  try {
    await userStore.registerUser(userData.value)
    showSuccessAlert('El usuario ha sido registrado correctamente.')
    setTimeout(() => router.push('/gestionUsers'), 2000)
  } catch (error) {
    showErrorAlert('No se pudo registrar el usuario.')
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease-in-out;
}

.input:focus {
  border-color: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.5);
  outline: none;
}

.input.border-red-500 {
  border-color: #ef4444;
}

.btn-primary {
  background-color: #34d399;
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #2f9e79;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #4b5563;
}
</style>
