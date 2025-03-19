<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-3">
      <h2 class="text-xl italic font-bold text-gray-900 dark:text-white">
        Detalles del Restaurante
      </h2>
    </div>

    <div
      class="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg animate-fade-in max-w-full mx-auto"
    >
      <form class="space-y-6">
        <div class="flex justify-center">
          <img
            :src="restaurant.imagen || 'https://source.unsplash.com/400x300/?restaurant'"
            alt="Imagen del restaurante"
            class="restaurant-image"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <input v-model="restaurant.nombre" type="text" class="input" :disabled="!isEditing" />
            <label class="label">Nombre</label>
          </div>

          <div>
            <input
              v-model="restaurant.direccion"
              type="text"
              class="input"
              :disabled="!isEditing"
            />
            <label class="label">Dirección</label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <input v-model="restaurant.telefono" type="text" class="input" :disabled="!isEditing" />
            <label class="label">Teléfono</label>
          </div>

          <div>
            <input v-model="restaurant.horario" type="text" class="input" :disabled="!isEditing" />
            <label class="label">Horario</label>
          </div>
        </div>

        <div>
          <textarea
            v-model="restaurant.descripcion"
            class="input h-24 resize-none"
            :disabled="!isEditing"
          ></textarea>
          <label class="label">Descripción</label>
        </div>

        <div>
          <input v-model="restaurant.encargado" type="text" class="input disabled" disabled />
          <label class="label">Encargado</label>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button @click="goBack" type="button" class="btn-secondary">
            <i class="fas fa-arrow-left mr-2"></i> Volver
          </button>
          <button v-if="isEditing" @click.prevent="saveChanges" class="btn-primary">
            <i class="fas fa-save mr-2"></i> Guardar Cambios
          </button>
          <button v-else @click.prevent="enableEditing" class="btn-edit">
            <i class="fas fa-edit mr-2"></i> Editar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { restaurantService } from '@/services/restaurantService'
import { showSuccessAlert, showErrorAlert, showEditModeAlert } from '@/utils/swalUtils'

const route = useRoute()
const router = useRouter()
const isEditing = ref(false)

const restaurant = ref({
  nombre: '',
  direccion: '',
  telefono: '',
  horario: '',
  imagen: '',
  descripcion: '',
  encargado: '',
})

onMounted(async () => {
  try {
    const restaurantId = route.params.id
    const data = await restaurantService.getRestaurantById(restaurantId)

    restaurant.value = {
      nombre: data.restauranteNombre,
      direccion: data.direccion,
      telefono: data.telefono,
      horario: data.horario,
      imagen: data.imagenUrl,
      descripcion: data.descripcion,
      encargado: data.usuario?.username || 'No asignado',
    }
  } catch {
    showErrorAlert('No se pudieron cargar los detalles del restaurante.')
  }
})

const enableEditing = () => {
  isEditing.value = true
  showEditModeAlert()
}

const saveChanges = async () => {
  try {
    await restaurantService.updateRestaurant(route.params.id, restaurant.value)
    isEditing.value = false
    showSuccessAlert('Los cambios han sido guardados exitosamente.')
  } catch {
    showErrorAlert('Error al guardar los cambios.')
  }
}

const goBack = () => {
  router.push('/restaurantes-admin')
}
</script>

<style scoped>
.restaurant-image {
  width: 500px;
  height: 150px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

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

.input.disabled {
  background-color: #e5e7eb;
  color: #6b7280;
}

.label {
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
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

.btn-edit {
  background-color: #ffc83ec7;
  color: black;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #f59e0b;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
</style>
