<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white italic">Gestión de Usuarios</h2>

      <div class="flex items-center space-x-4">
        <select
          v-model="rolSeleccionado"
          @change="filtrarPorRol"
          class="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300"
        >
          <option value="">Todos</option>
          <option value="3">Hostess</option>
          <option value="1">Administradores</option>
          <option value="2">Usuarios</option>
        </select>

        <span class="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-full">
          Activos: {{ totalActivos }}
        </span>
        <span class="px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-full">
          Inactivos: {{ totalInactivos }}
        </span>

        <button
          @click="mostrarModalCrear = true"
          class="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition-all shadow-md"
        >
          + Agregar
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr
            class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 uppercase text-sm font-semibold"
          >
            <th class="py-3 px-4 text-left">#</th>
            <th class="py-3 px-4 text-left">Nombre</th>
            <th class="py-3 px-4 text-left">Correo</th>
            <th class="py-3 px-4 text-center">Estado</th>
            <th class="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(usuario, index) in usuariosFiltrados"
            :key="usuario.usuarioId"
            class="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <td class="py-4 px-4">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="py-4 px-4 font-semibold">{{ usuario.username }}</td>
            <td class="py-4 px-4 text-gray-700 dark:text-gray-300">{{ usuario.email }}</td>
            <td class="py-4 px-4 text-center">
              <span
                :class="usuario.isDeleted ? 'bg-red-500 text-white' : 'bg-green-500 text-white'"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ usuario.isDeleted ? 'Inactivo' : 'Activo' }}
              </span>
              <button
                v-if="usuario.isDeleted"
                @click="toggleState(usuario.usuarioId)"
                class="ml-2 text-yellow-500 hover:text-yellow-700"
                title="Activar Usuario"
              >
                <i class="fas fa-lock-open"></i>
              </button>
            </td>
            <td class="py-4 px-4 text-center">
              <div class="flex items-center justify-center space-x-3">
                <button
                  class="bg-red-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                  @click="deleteUser(usuario.usuarioId)"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <button
                  class="bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
                  @click="abrirModalEditar(usuario.usuarioId)"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center mt-6">
      <button
        class="px-4 py-2 mx-1 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition-all"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        «
      </button>
      <span class="px-4 py-2 mx-1 bg-gray-900 text-white rounded-full font-semibold">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 mx-1 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition-all"
        :disabled="currentPage === totalPages"
        @click="nextPage"
      >
        »
      </button>
    </div>

    <ModalCrearUsuario
      v-if="mostrarModalCrear"
      @cerrar="mostrarModalCrear = false"
      @usuario-creado="refrescarUsuarios"
    />
    <ModalEditarUsuario
      v-if="mostrarModalEditar"
      :id="usuarioEditarId"
      @cerrar="cerrarModalEditar"
      @usuario-editado="refrescarUsuarios"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { showDeleteConfirm, showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'
import ModalCrearUsuario from '../Admin/CreateUser.vue'
import ModalEditarUsuario from '../Admin/EditUser.vue'

const userStore = useUserStore()

const mostrarModalCrear = ref(false)
const mostrarModalEditar = ref(false)
const usuarioEditarId = ref(null)
const rolSeleccionado = ref('')

const refrescarUsuarios = async () => {
  await userStore.fetchAllUsers()
}

onMounted(refrescarUsuarios)

const paginatedUsers = computed(() => userStore.paginatedUsers)
const totalPages = computed(() => userStore.totalPages)
const totalActivos = computed(() => userStore.totalActivos)
const totalInactivos = computed(() => userStore.totalInactivos)
const currentPage = computed(() => userStore.currentPage)
const itemsPerPage = computed(() => userStore.itemsPerPage)

const usuariosFiltrados = computed(() => {
  if (!rolSeleccionado.value) return paginatedUsers.value

  return paginatedUsers.value.filter((user) => {
    const roles = Array.isArray(user.roles) ? user.roles : user.roles?.$values || []

    return roles.includes(Number(rolSeleccionado.value))
  })
})

const prevPage = () => userStore.prevPage()
const nextPage = () => userStore.nextPage()

const abrirModalEditar = (id) => {
  usuarioEditarId.value = id
  mostrarModalEditar.value = true
}

const cerrarModalEditar = () => {
  mostrarModalEditar.value = false
  usuarioEditarId.value = null
}

const deleteUser = async (userId) => {
  showDeleteConfirm(async () => {
    await userStore.deleteUser(userId)
    await refrescarUsuarios()
    showSuccessAlert('Usuario eliminado correctamente.')
  })
}

const toggleState = async (userId) => {
  try {
    const user = userStore.allUsers.find((u) => u.usuarioId === userId)
    const newState = !user.isDeleted
    await userStore.updateUserState(userId, newState)
    await refrescarUsuarios()
    showSuccessAlert(`El usuario ha sido ${newState ? 'desactivado' : 'activado'} exitosamente.`)
  } catch (error) {
    showErrorAlert('Error al cambiar el estado del usuario.')
    console.error(error)
  }
}

const filtrarPorRol = () => {
  userStore.currentPage = 1
}
</script>

<style scoped>
tr:hover {
  transition: background-color 0.2s ease-in-out;
}
button {
  transition: all 0.2s ease-in-out;
}
</style>
