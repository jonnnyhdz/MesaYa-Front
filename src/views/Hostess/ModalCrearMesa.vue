<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-25 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg animate-modal">
      <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Crear Mesa</h3>
      <form @submit.prevent="crearMesa">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Número de Mesa</label
            >
            <input
              v-model.number="mesa.mesaNumero"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Capacidad</label
            >
            <input
              v-model.number="mesa.capacidad"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Disponible</label
            >
            <select
              v-model="mesa.disponible"
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
        </div>
        <div class="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { hostessService } from '@/services/hostessService'
import Swal from 'sweetalert2'

const route = useRoute()
const emit = defineEmits(['cerrar', 'mesa-creada'])

const mesa = ref({
  mesaNumero: 0,
  capacidad: 0,
  disponible: true,
  restauranteId: Number(route.params.id),
})

const crearMesa = async () => {
  try {
    const mesaCreada = await hostessService.crearMesa(mesa.value)
    Swal.fire({
      icon: 'success',
      title: 'Mesa creada',
      text: 'La mesa se ha creado correctamente.',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    })
    emit('mesa-creada', mesaCreada)
    emit('cerrar')
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear la mesa. Por favor, inténtalo de nuevo.',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    })
    console.error('Error al crear la mesa:', error)
  }
}
</script>

<style scoped>
@keyframes modalAnimation {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-modal {
  animation: modalAnimation 0.4s ease-out;
}
</style>
