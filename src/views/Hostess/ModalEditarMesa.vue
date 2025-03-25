<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-25 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg animate-modal">
      <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Editar Mesa</h3>
      <form @submit.prevent="editarMesa">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Número de Mesa</label
            >
            <input
              v-model.number="mesaLocal.mesaNumero"
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
              v-model.number="mesaLocal.capacidad"
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
              v-model="mesaLocal.disponible"
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
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { hostessService } from '@/services/hostessService'
import Swal from 'sweetalert2'

const props = defineProps<{ mesa: any }>()
const emit = defineEmits(['cerrar', 'mesa-editada'])

const mesaLocal = ref({ ...props.mesa })

watch(
  () => props.mesa,
  (newMesa) => {
    mesaLocal.value = { ...newMesa }
  },
)

const editarMesa = async () => {
  try {
    const mesaActualizada = await hostessService.editarMesa(mesaLocal.value)
    Swal.fire({
      title: 'Mesa actualizada',
      text: 'La mesa se ha actualizado correctamente.',
      icon: 'success',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    })
    emit('mesa-editada', mesaActualizada)
    emit('cerrar')
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'No se pudo actualizar la mesa. Por favor, inténtalo de nuevo.',
      icon: 'error',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: false,
    })
    console.error('Error al editar la mesa:', error)
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
