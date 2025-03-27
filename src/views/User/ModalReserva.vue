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

      <label class="block text-sm font-medium mb-1">Fecha:</label>
      <input
        v-model="fechaSeleccionada"
        type="date"
        class="w-full mb-4 border px-3 py-2 rounded"
      />

      <label class="block text-sm font-medium mb-1">Horarios disponibles:</label>
      <select
        v-model="horarioSeleccionado"
        class="w-full mb-4 border px-3 py-2 rounded"
      >
        <option value="" disabled>Selecciona un horario</option>
        <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
          {{ hora }}
        </option>
      </select>

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
import { ref, watch, onMounted } from 'vue'
import { useReservaStore } from '@/stores/reservaStore'
import { useAuthStore } from '@/stores/authStore'
import { reservaService } from '@/services/reservaService'
import type { IMesa } from '@/interfaces/RestaurantInterface'

const props = defineProps<{ mesa: IMesa }>()
const emit = defineEmits(['cerrar', 'reserva-exitosa'])

const authStore = useAuthStore()
const reservaStore = useReservaStore()

const reserva = ref({
  mesaId: props.mesa.mesaId,
  usuarioId: authStore.usuarioId || 0,
  fechaReserva: '', // se llenará automáticamente
  numeroPersonas: 1,
})

const fechaSeleccionada = ref(new Date().toISOString().slice(0, 10)) // YYYY-MM-DD
const horariosDisponibles = ref<string[]>([])
const horarioSeleccionado = ref('')

// Cargar disponibilidad al seleccionar fecha
watch(fechaSeleccionada, async (nuevaFecha) => {
  try {
    const fechaFormateada = new Date(nuevaFecha).toLocaleDateString('en-US') // MM/DD/YY
    horariosDisponibles.value = await reservaService.obtenerDisponibilidad(
      props.mesa.mesaId,
      fechaFormateada
    )
  } catch (error) {
    console.error('Error al obtener disponibilidad', error)
    horariosDisponibles.value = []
  }
})

// Combinar fecha y hora al seleccionar horario
watch(horarioSeleccionado, (hora) => {
  if (hora && fechaSeleccionada.value) {
    reserva.value.fechaReserva = `${fechaSeleccionada.value}T${hora}`
  }
})

// Cargar horarios al abrir el modal
onMounted(() => {
  fechaSeleccionada.value = new Date().toISOString().slice(0, 10)
})

const confirmarReserva = async () => {
  try {
    if (!authStore.usuarioId) {
      alert('Debes iniciar sesión para reservar.')
      return
    }

    if (!reserva.value.fechaReserva) {
      alert('Selecciona un horario disponible.')
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
