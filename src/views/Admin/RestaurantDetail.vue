<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl transform transition-all scale-95 animate-fade-in-up p-6"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Editar Restaurante</h2>
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

      <form @submit.prevent="saveChanges" class="space-y-5">
        <div class="flex justify-center">
          <img
            :src="restaurant.imagen || 'https://source.unsplash.com/400x300/?restaurant'"
            alt="Imagen del restaurante"
            class="w-full max-w-md h-40 object-cover rounded-xl shadow"
          />
        </div>

        <input
          v-model="restaurant.imagen"
          type="text"
          placeholder="URL de la imagen"
          class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
          :disabled="!isEditing"
        />

        <div class="grid md:grid-cols-2 gap-4">
          <input
            v-model="restaurant.nombre"
            type="text"
            placeholder="Nombre"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :disabled="!isEditing"
          />

          <input
            v-model="restaurant.direccion"
            type="text"
            placeholder="Dirección"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :disabled="!isEditing"
          />
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <input
            v-model="restaurant.telefono"
            type="text"
            placeholder="Teléfono"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :disabled="!isEditing"
          />

          <input
            v-model="restaurant.horario"
            type="text"
            placeholder="Horario"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :disabled="!isEditing"
          />
        </div>

        <textarea
          v-model="restaurant.descripcion"
          placeholder="Descripción"
          class="w-full h-24 rounded-xl border border-gray-300 px-4 py-2 resize-none focus:ring-2 focus:ring-green-400 focus:outline-none"
          :disabled="!isEditing"
        ></textarea>

        <div>
          <label class="block text-sm mb-1 text-gray-700">Encargado (Hostess)</label>
          <select
            v-model="restaurant.userId"
            class="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
            :disabled="!isEditing"
          >
            <option value="" disabled>Selecciona un encargado</option>
            <option v-for="user in users" :key="user.usuarioId" :value="user.usuarioId">
              {{ user.username }}
            </option>
          </select>
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

<script setup>
import { ref, onMounted } from 'vue'
import { restaurantService } from '@/services/restaurantService'
import { userService } from '@/services/userService'
import { showSuccessAlert, showErrorAlert, showEditModeAlert } from '@/utils/swalUtils'

const props = defineProps({
  id: { type: String, required: true },
})

const emit = defineEmits(['cerrar', 'restaurante-actualizado'])

const isEditing = ref(false)

const restaurant = ref({
  nombre: '',
  direccion: '',
  telefono: '',
  horario: '',
  imagen: '',
  descripcion: '',
  userId: null,
})

const users = ref([])

onMounted(async () => {
  try {
    const data = await restaurantService.getRestaurantById(props.id)
    restaurant.value = {
      nombre: data.restauranteNombre,
      direccion: data.direccion,
      telefono: data.telefono,
      horario: data.horario,
      imagen: data.imagenUrl,
      descripcion: data.descripcion,
      userId: data.userId || null,
    }
    users.value = await userService.getHostessUsers()
  } catch (error) {
    showErrorAlert('No se pudieron cargar los datos del restaurante.')
  }
})

const enableEditing = () => {
  isEditing.value = true
  showEditModeAlert()
}

const saveChanges = async () => {
  try {
    const updatedRestaurant = {
      restauranteNombre: restaurant.value.nombre,
      direccion: restaurant.value.direccion,
      telefono: restaurant.value.telefono,
      horario: restaurant.value.horario,
      imagenUrl: restaurant.value.imagen || '',
      descripcion: restaurant.value.descripcion,
      userId: restaurant.value.userId || null,
    }

    await restaurantService.updateRestaurant(props.id, updatedRestaurant)
    isEditing.value = false
    showSuccessAlert('Restaurante actualizado correctamente.')
    emit('restaurante-actualizado')
    emit('cerrar')
  } catch (error) {
    showErrorAlert('Error al guardar los cambios.')
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
