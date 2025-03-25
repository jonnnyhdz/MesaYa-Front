<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl transform transition-all scale-95 animate-fade-in-up p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Usuario</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-red-600 text-xl">
          ✖
        </button>
      </div>

      <div
        v-if="!isEditing"
        class="flex items-center gap-2 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-md px-4 py-2 text-sm mb-4"
      >
        <i class="fas fa-info-circle"></i>
        <span>
          Para editar los campos, haz clic en el botón
          <strong>Editar</strong> y luego en <strong>Guardar</strong>.
        </span>
      </div>

      <form @submit.prevent="submitForm" class="space-y-5">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >Nombre de Usuario</label
            >
            <input
              v-model="form.username"
              type="text"
              class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              :disabled="!isEditing"
            />
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >Correo Electrónico</label
            >
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              :disabled="!isEditing"
            />
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
            >Contraseña</label
          >
          <input
            v-model="form.passwordHash"
            type="password"
            placeholder="Dejar en blanco para no cambiar"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :disabled="!isEditing"
          />
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >Estado</label
            >
            <select
              v-model="form.isDeleted"
              class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              :disabled="!isEditing"
            >
              <option :value="false">Activo</option>
              <option :value="true">Inactivo</option>
            </select>
          </div>

          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >Rol</label
            >
            <select
              v-model="form.roleIds[0]"
              class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              :disabled="!isEditing"
            >
              <option value="1">Admin</option>
              <option value="2">Usuario</option>
              <option value="3">Hostess</option>
            </select>
          </div>
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
            v-if="isEditing"
            type="submit"
            class="bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-full px-5 py-2"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userService } from '@/services/userService'
import { showSuccessAlert, showErrorAlert, showEditModeAlert } from '@/utils/swalUtils'

const props = defineProps({
  id: { type: Number, required: true },
})

const emit = defineEmits(['cerrar', 'usuario-editado'])

const isEditing = ref(false)

interface EditUserForm {
  usuarioId: number | null
  username: string
  email: string
  passwordHash: string
  isDeleted: boolean
  roleIds: number[]
}

const user = ref<any>(null)
const form = ref<EditUserForm>({
  usuarioId: null,
  username: '',
  email: '',
  passwordHash: '',
  isDeleted: false,
  roleIds: [2],
})

onMounted(async () => {
  try {
    const data = await userService.getUserById(props.id)
    user.value = data

    form.value.usuarioId = data.usuarioId
    form.value.username = data.username
    form.value.email = data.email
    form.value.passwordHash = ''
    form.value.isDeleted = data.isDeleted
    form.value.roleIds = data.roles?.$values || [2]

    user.value.passwordHash = data.passwordHash
  } catch (error) {
    showErrorAlert('No se pudo cargar el usuario.')
    emit('cerrar')
  }
})

const enableEditing = () => {
  isEditing.value = true
  showEditModeAlert()
}

const submitForm = async () => {
  try {
    const selectedRoleId = parseInt(form.value.roleIds[0])
    const payload = {
      usuarioId: form.value.usuarioId,
      username: form.value.username.trim() || user.value.username,
      email: form.value.email.trim() || user.value.email,
      isDeleted: form.value.isDeleted,
      roleIds: [selectedRoleId],
      passwordHash:
        form.value.passwordHash.trim() !== '' ? form.value.passwordHash : user.value.passwordHash,
    }

    await userService.editUser(payload)
    showSuccessAlert('Usuario actualizado correctamente.')
    emit('usuario-editado')
    emit('cerrar')
  } catch (error: any) {
    showErrorAlert(error.message || 'No se pudo editar el usuario.')
    console.error(error)
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
