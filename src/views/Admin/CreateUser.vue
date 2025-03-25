<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg transform transition-all scale-95 animate-fade-in-up p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Nuevo Usuario</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-red-600 text-xl">
          ✖
        </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-5 relative">
        <div>
          <input
            v-model="userData.username"
            type="text"
            placeholder="Nombre de usuario"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :class="{ 'border-red-500': v$.username.$error }"
          />
          <p v-if="v$.username.$error" class="text-sm text-red-500 mt-1">
            {{ getErrorMessage('username') }}
          </p>
        </div>

        <div>
          <input
            v-model="userData.email"
            type="email"
            placeholder="Correo electrónico"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :class="{ 'border-red-500': v$.email.$error }"
          />
          <p v-if="v$.email.$error" class="text-sm text-red-500 mt-1">
            {{ getErrorMessage('email') }}
          </p>
        </div>

        <div class="relative">
          <input
            v-model="userData.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Contraseña"
            class="w-full rounded-xl border border-gray-300 px-4 py-3 pr-10 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :class="{ 'border-red-500': v$.password.$error }"
          />
          <i
            :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 cursor-pointer hover:text-blue-500"
            @click="togglePassword"
          ></i>
          <p v-if="v$.password.$error" class="text-sm text-red-500 mt-1">
            {{ getErrorMessage('password') }}
          </p>
        </div>

        <div class="flex justify-end gap-4 pt-4">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-full px-5 py-2"
          >
            <i class="fas fa-times mr-2"></i>Cancelar
          </button>
          <button
            type="submit"
            class="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-5 py-2"
          >
            <i class="fas fa-save mr-2"></i>Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, email } from '@vuelidate/validators'

const emit = defineEmits(['cerrar', 'usuario-creado'])
const userStore = useUserStore()

const userData = ref({
  username: '',
  email: '',
  password: '',
})

const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const rules = computed(() => ({
  username: { required, minLength: minLength(3), maxLength: maxLength(50) },
  email: { required, email },
  password: { required, minLength: minLength(8), maxLength: maxLength(20) },
}))

const validationMessages = {
  required: 'Este campo es obligatorio.',
  minLength: (l) => `Debe contener al menos ${l} caracteres.`,
  maxLength: (l) => `Debe contener como máximo ${l} caracteres.`,
  email: 'Debe ser un correo electrónico válido.',
}

const v$ = useVuelidate(rules, userData)

const getErrorMessage = (field) => {
  if (!v$.value[field].$error) return ''
  const error = v$.value[field].$errors[0]
  if (error.$validator === 'required') return validationMessages.required
  if (error.$validator === 'minLength') return validationMessages.minLength(error.$params.min)
  if (error.$validator === 'maxLength') return validationMessages.maxLength(error.$params.max)
  if (error.$validator === 'email') return validationMessages.email
  return 'Error desconocido.'
}

const submitForm = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    showErrorAlert('Por favor, completa todos los campos correctamente.')
    return
  }

  try {
    await userStore.registerUser(userData.value)
    showSuccessAlert('Usuario registrado correctamente.')
    emit('usuario-creado')
    emit('cerrar')
  } catch (error) {
    showErrorAlert('No se pudo registrar el usuario.')
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>
