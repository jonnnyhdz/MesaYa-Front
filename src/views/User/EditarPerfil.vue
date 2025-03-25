<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl transform transition-all scale-95 animate-fade-in-up p-6"
    >
      <!-- Encabezado -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Mi Perfil</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-red-600 text-xl">
          ✖
        </button>
      </div>

      <!-- Mensaje de información -->
      <div
        v-if="!isEditing"
        class="flex items-center gap-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-2 text-sm mb-4"
      >
        <i class="fas fa-info-circle"></i>
        <span>
          Para modificar tu perfil, haz clic en <strong>Editar</strong>, luego en
          <strong>Guardar</strong>.
        </span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="submitForm" class="space-y-5">
        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >Nombre de Usuario</label
          >
          <input
            v-model="form.username"
            type="text"
            :disabled="!isEditing"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >Correo Electrónico</label
          >
          <input
            v-model="form.email"
            type="email"
            :disabled="!isEditing"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >Nueva Contraseña</label
          >
          <input
            v-model="form.password"
            type="password"
            placeholder="Opcional: deja en blanco para no cambiarla"
            :disabled="!isEditing"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-4 pt-4">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-full px-5 py-2"
          >
            <i class="fas fa-times mr-2"></i>Cancelar
          </button>

          <button
            v-if="isEditing"
            type="submit"
            class="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-full px-5 py-2"
          >
            <i class="fas fa-save mr-2"></i>Guardar
          </button>

          <button
            v-else
            type="button"
            @click="enableEditing"
            class="bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-full px-5 py-2"
          >
            <i class="fas fa-edit mr-2"></i>Editar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userService } from '@/services/userService'
import { showSuccessAlert, showErrorAlert, showEditModeAlert } from '@/utils/swalUtils'
import { useAuthStore } from '@/stores/authStore'

const emit = defineEmits(['cerrar'])

const authStore = useAuthStore()
const isEditing = ref(false)
const usuarioId = localStorage.getItem('usuarioId')

const form = ref({
  username: '',
  email: '',
  password: '',
})

const enableEditing = () => {
  isEditing.value = true
  showEditModeAlert()
}

onMounted(async () => {
  try {
    const user = await userService.getUserById(usuarioId)
    form.value.username = user.username
    form.value.email = user.email
  } catch (error) {
    showErrorAlert('No se pudo cargar tu información.')
  }
})

const submitForm = async () => {
  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
    }

    await userService.editProfile(usuarioId, payload)

    authStore.nombre = form.value.username
    localStorage.setItem('nombre', form.value.username)

    showSuccessAlert('Perfil actualizado correctamente.')
    emit('cerrar')
  } catch (error) {
    showErrorAlert('Error al actualizar el perfil.')
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
