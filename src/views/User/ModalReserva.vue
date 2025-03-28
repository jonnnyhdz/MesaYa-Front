<template>
  <transition name="fade">
    <div class="fixed inset-0 flex justify-center items-center bg-opacity-40 backdrop-blur-sm z-50">
      <div class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up">
        <h3 class="text-2xl font-bold text-gray-800 mb-6 text-center">
          Reservar Mesa #{{ mesa?.numeroMesa }}
        </h3>

        <!-- Número de personas -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Número de personas
          </label>
          <input
            v-model="reserva.numeroPersonas"
            type="number"
            min="1"
            placeholder="Ingrese cantidad"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Fecha -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Selecciona una fecha
          </label>
          <input
            v-model="fechaSeleccionada"
            type="date"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :min="hoy"
          />
        </div>

        <!-- Horarios -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Selecciona un horario
          </label>
          <select
            v-model="horarioSeleccionado"
            class="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un horario</option>
            <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
              {{ hora }}
            </option>
          </select>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3">
          <button @click="$emit('cerrar')" class="text-gray-500 hover:underline text-sm">
            Cancelar
          </button>
          <button
            @click="confirmarReserva"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm shadow-md"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useReservaStore } from '@/stores/reservaStore'
import { useAuthStore } from '@/stores/authStore'
import { reservaService } from '@/services/reservaService'
import { useRouter } from 'vue-router'
import type { IMesa } from '@/interfaces/RestaurantInterface'
import Swal from 'sweetalert2'

const props = defineProps<{ mesa: IMesa }>()
const emit = defineEmits(['cerrar', 'reserva-exitosa'])

const authStore = useAuthStore()
const reservaStore = useReservaStore()
const router = useRouter()

const hoy = new Date().toISOString().split('T')[0]

const reserva = ref({
  mesaId: props.mesa.mesaId,
  usuarioId: authStore.usuarioId || 0,
  fechaReserva: '',
  numeroPersonas: 1
})

// Fecha seleccionada en el <input type="date">
const fechaSeleccionada = ref('')

// Lista de horarios que nos da el backend (cada media hora)
const horariosDisponibles = ref<string[]>([])

// Horario elegido en <select>
const horarioSeleccionado = ref('')

// 🎯 1) Cada vez que cambie la fecha, pedimos disponibilidad
watch(fechaSeleccionada, async (nuevaFecha) => {
  try {
    if (!nuevaFecha) {
      horariosDisponibles.value = []
      return
    }

    // Para evitar ambigüedades de cultura, enviar en formato ISO (YYYY-MM-DD)
    const fechaFormateada = new Date(nuevaFecha).toISOString().split('T')[0]

    horariosDisponibles.value = await reservaService.obtenerDisponibilidad(
      props.mesa.mesaId,
      fechaFormateada
    )
  } catch (error) {
    console.error('Error al obtener disponibilidad', error)
    horariosDisponibles.value = []
  }
})

// 🎯 2) Cuando el usuario elige un horario, formamos fechaReserva en formato ISO
watch(horarioSeleccionado, (hora) => {
  if (hora && fechaSeleccionada.value) {
    reserva.value.fechaReserva = `${fechaSeleccionada.value}T${hora}`
  }
})

const confirmarReserva = async () => {
  try {
    if (!reserva.value.fechaReserva || !horarioSeleccionado.value) {
      Swal.fire('Falta información', 'Por favor, selecciona fecha y horario.', 'warning')
      return
    }

    Swal.fire({
      title: 'Procesando reserva...',
      text: 'Por favor espera un momento.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await reservaStore.crearReserva(reserva.value)

    Swal.fire({
      icon: 'success',
      title: '¡Reserva confirmada!',
      text: 'Serás redirigido a tu panel de usuario.',
      timer: 1800,
      showConfirmButton: false
    })

    setTimeout(() => {
      emit('reserva-exitosa')
      emit('cerrar')
      router.push('/dashboard-usuario')
    }, 1800)
  } catch (error) {
    Swal.fire('Error', 'No se pudo realizar la reserva.', 'error')
    console.error(error)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
