<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white italic">Editar Usuario</h2>
    </div>
    <div
      class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg animate-fade-in max-w-full mx-auto"
    >
      <div v-if="user">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Nombre de usuario -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
            <input v-model="form.username" type="text" class="input" />
          </div>
          <!-- Correo electrónico -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input v-model="form.email" type="email" class="input" />
          </div>
          <!-- Contraseña (opcional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              v-model="form.passwordHash"
              type="password"
              class="input"
              placeholder="Dejar en blanco para no cambiar"
            />
          </div>
          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <select v-model="form.isDeleted" class="input">
              <option :value="false">Activo</option>
              <option :value="true">Inactivo</option>
            </select>
          </div>
          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Rol</label>
            <select v-model="form.roleIds[0]" class="input">
              <option value="1">Admin</option>
              <option value="2">Usuario</option>
              <option value="3">Hostess</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" class="btn-secondary" @click="goBack">
              <i class="fas fa-arrow-left mr-2"></i>Cancelar
            </button>
            <button type="submit" class="btn-primary">
              <i class="fas fa-save mr-2"></i>Guardar Cambios
            </button>
          </div>
        </form>
      </div>
      <div v-else>
        <p>Cargando datos del usuario...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userService } from '@/services/userService'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'

interface EditUserForm {
  usuarioId: number | null
  username: string
  email: string
  passwordHash: string
  isDeleted: boolean
  roleIds: number[]
}

const route = useRoute()
const router = useRouter()
const userId = Number(route.params.userId)

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
    if (!userId) throw new Error('El ID del usuario no fue proporcionado.')

    const data = await userService.getUserById(userId)
    user.value = data

    form.value.usuarioId = data.usuarioId
    form.value.username = data.username
    form.value.email = data.email
    form.value.passwordHash = '' // Se deja en blanco visualmente, pero se usará el original si no se cambia
    form.value.isDeleted = data.isDeleted
    form.value.roleIds = data.roles?.$values || [2]

    // Guardamos también la contraseña original para usarla si no se edita
    user.value.passwordHash = data.passwordHash
  } catch (error) {
    showErrorAlert('No se pudo cargar el usuario.')
    console.error(error)
    router.push('/gestionUsers')
  }
})

const submitForm = async () => {
  try {
    const selectedRoleId = parseInt(form.value.roleIds[0]) // 💥 Nos aseguramos de que sea número

    const payload = {
      usuarioId: form.value.usuarioId,
      username: form.value.username.trim() || user.value.username,
      email: form.value.email.trim() || user.value.email,
      isDeleted: form.value.isDeleted,
      roleIds: [selectedRoleId], // 💥 Aquí lo mandamos asegurado
      passwordHash:
        form.value.passwordHash.trim() !== '' ? form.value.passwordHash : user.value.passwordHash,
    }

    const response = await userService.editUser(payload)
    showSuccessAlert(response.message || 'Usuario editado con éxito.')
    router.push('/gestionUsers')
  } catch (error: any) {
    showErrorAlert(error.message || 'No se pudo editar el usuario.')
    console.error(error)
  }
}

const goBack = () => {
  router.push('/gestionUsers')
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
.btn-primary {
  background-color: #34d399;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-primary:hover {
  background-color: #2f9e79;
}
.btn-secondary {
  background-color: #6b7280;
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-secondary:hover {
  background-color: #4b5563;
}
</style>
