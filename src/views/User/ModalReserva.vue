<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Reservar Mesa #{{ mesa?.numeroMesa }}</h3>

      <label class="block text-sm font-medium mb-1">Número de personas:</label>
      <input
        v-model="reserva.numeroPersonas"
        type="number"
        min="1"
        class="w-full mb-4 border px-3 py-2 rounded"
      />

      <label class="block text-sm font-medium mb-1">Fecha y hora:</label>
      <input
        v-model="reserva.fechaReserva"
        type="datetime-local"
        class="w-full mb-4 border px-3 py-2 rounded"
      />

      <div class="flex justify-end gap-3">
        <button @click="$emit('cerrar')" class="text-gray-600 text-sm">Cancelar</button>
        <button
          @click="confirmarReserva"
          class="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useReservaStore } from '@/stores/reservaStore'
import { useAuthStore } from '@/stores/authStore'
import type { IMesa } from '@/interfaces/RestaurantInterface'

const props = defineProps<{ mesa: IMesa }>()
const emit = defineEmits(['cerrar', 'reserva-exitosa'])

const authStore = useAuthStore()
const reservaStore = useReservaStore()

const reserva = ref({
  mesaId: props.mesa.mesaId,
  usuarioId: authStore.usuarioId || 0, // CORREGIDO
  fechaReserva: new Date().toISOString().slice(0, 16),
  numeroPersonas: 1,
})

const confirmarReserva = async () => {
  try {
    if (!authStore.usuarioId) {
      alert('Debes iniciar sesión para reservar.')
      return
    }

    await reservaStore.crearReserva(reserva.value)
    alert('✅ Reservación realizada correctamente')
    emit('reserva-exitosa')
    emit('cerrar')
  } catch (error) {
    alert('❌ Error al reservar la mesa')
    console.error(error)
  }
}
</script>
