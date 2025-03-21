<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-xl font-bold mb-4">Crear Mesa</h3>
      <form @submit.prevent="crearMesa">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Número de Mesa</label>
            <input
              v-model="mesa.mesaNumero"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Capacidad</label>
            <input
              v-model="mesa.capacidad"
              type="number"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Disponible</label>
            <select
              v-model="mesa.disponible"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            >
              <option :value="true">Sí</option>
              <option :value="false">No</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
const emit = defineEmits(['cerrar', 'mesa-creada']) // Emitir evento para actualizar la lista de mesas

const mesa = ref({
  mesaNumero: 0,
  capacidad: 0,
  disponible: true,
  restauranteId: Number(route.params.id), // Asegúrate de que el ID del restaurante sea correcto
})

const crearMesa = async () => {
  try {
    const mesaCreada = await hostessService.crearMesa(mesa.value)
    console.log('Mesa creada:', mesaCreada) // Verifica la respuesta del backend

    // Muestra una alerta de éxito
    Swal.fire({
      icon: 'success',
      title: 'Mesa creada',
      text: 'La mesa se ha creado correctamente.',
      confirmButtonText: 'Aceptar',
    })

    emit('mesa-creada', mesaCreada) // Emite el evento para actualizar la lista de mesas
    emit('cerrar') // Cierra el modal
  } catch (error) {
    // Muestra una alerta de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo crear la mesa. Por favor, inténtalo de nuevo.',
      confirmButtonText: 'Aceptar',
    })
    console.error('Error al crear la mesa:', error)
  }
}
</script>
