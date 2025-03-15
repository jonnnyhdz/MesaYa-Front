<template>
  <div class="p-8">
    <!-- 🔹 Bienvenida -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        👋 Hola, <span class="text-blue-500">{{ nombre }}</span>
      </h2>
    </div>

    <!-- 🔹 Resumen de Mesas -->
    <div class="grid grid-cols-3 gap-6 my-6">
      <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p class="text-2xl font-bold">{{ mesasDisponibles.length }}</p>
        <p class="text-lg">Mesas Disponibles</p>
      </div>
      <div class="bg-gray-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p class="text-2xl font-bold">{{ mesasOcupadas.length }}</p>
        <p class="text-lg">Mesas Ocupadas</p>
      </div>
      <div class="bg-yellow-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p class="text-2xl font-bold">{{ listaEspera.length }}</p>
        <p class="text-lg">En Lista de Espera</p>
      </div>
    </div>

    <!-- 🔹 Gestión de Reservas -->
    <h2 class="text-2xl font-bold my-4">📅 Reservas Actuales</h2>
    <div v-if="reservas.length" class="bg-gray-900 text-white rounded-lg p-6">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="pb-3">Cliente</th>
            <th class="pb-3">Mesa</th>
            <th class="pb-3">Hora</th>
            <th class="pb-3">Estado</th>
            <th class="pb-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id" class="border-t border-gray-700">
            <td class="py-3">{{ reserva.cliente }}</td>
            <td>{{ reserva.mesa }}</td>
            <td>{{ reserva.hora }}</td>
            <td>
              <span
                :class="reserva.estado === 'Confirmada' ? 'text-green-500' : 'text-yellow-500'"
                class="font-semibold"
              >
                {{ reserva.estado }}
              </span>
            </td>
            <td class="space-x-3">
              <button class="text-green-400" @click="confirmarReserva(reserva.id)">
                <i class="fas fa-check-circle"></i>
              </button>
              <button class="text-red-400" @click="cancelarReserva(reserva.id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 mt-3">No hay reservas en este momento.</p>

    <!-- 🔹 Lista de Espera -->
    <h2 class="text-2xl font-bold my-4">🕒 Lista de Espera</h2>
    <div v-if="listaEspera.length" class="bg-gray-900 text-white rounded-lg p-6">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="pb-3">Cliente</th>
            <th class="pb-3">Personas</th>
            <th class="pb-3">Estado</th>
            <th class="pb-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cliente in listaEspera" :key="cliente.id" class="border-t border-gray-700">
            <td class="py-3">{{ cliente.nombre }}</td>
            <td>{{ cliente.personas }}</td>
            <td class="text-yellow-500 font-semibold">Esperando</td>
            <td class="space-x-3">
              <button class="text-blue-400" @click="asignarMesa(cliente.id)">
                <i class="fas fa-chair"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 mt-3">No hay clientes en espera.</p>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const nombre = computed(() => authStore.nombre)

// 🔹 Simulación de mesas disponibles y ocupadas
const mesas = ref([
  { id: 1, numero: 'Mesa 1', disponible: true },
  { id: 2, numero: 'Mesa 2', disponible: false },
  { id: 3, numero: 'Mesa 3', disponible: true },
  { id: 4, numero: 'Mesa 4', disponible: false },
])

const mesasDisponibles = computed(() => mesas.value.filter((m) => m.disponible))
const mesasOcupadas = computed(() => mesas.value.filter((m) => !m.disponible))

// 🔹 Simulación de reservas activas
const reservas = ref([
  { id: 1, cliente: 'Carlos Pérez', mesa: 'Mesa 2', hora: '20:00', estado: 'Pendiente' },
  { id: 2, cliente: 'Ana López', mesa: 'Mesa 4', hora: '21:00', estado: 'Confirmada' },
])

// 🔹 Lista de espera
const listaEspera = ref([
  { id: 1, nombre: 'Sofía Gómez', personas: 3 },
  { id: 2, nombre: 'Luis Herrera', personas: 2 },
])

// 🔹 Confirmar Reserva
const confirmarReserva = (id) => {
  const reserva = reservas.value.find((r) => r.id === id)
  if (reserva) reserva.estado = 'Confirmada'
}

// 🔹 Cancelar Reserva
const cancelarReserva = (id) => {
  reservas.value = reservas.value.filter((r) => r.id !== id)
}

// 🔹 Asignar mesa desde la lista de espera
const asignarMesa = (id) => {
  const cliente = listaEspera.value.find((c) => c.id === id)
  if (cliente && mesasDisponibles.value.length > 0) {
    const mesaAsignada = mesasDisponibles.value[0]
    reservas.value.push({
      id: reservas.value.length + 1,
      cliente: cliente.nombre,
      mesa: mesaAsignada.numero,
      hora: 'Por definir',
      estado: 'Pendiente',
    })
    mesas.value = mesas.value.map((m) =>
      m.id === mesaAsignada.id ? { ...m, disponible: false } : m,
    )
    listaEspera.value = listaEspera.value.filter((c) => c.id !== id)
  }
}
</script>
