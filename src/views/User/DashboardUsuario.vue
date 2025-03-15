<template>
  <div class="p-8">
    <!-- 🔹 Bienvenida al Usuario -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">
        👋 Hola, <span class="text-black dark:text-white font-extrabold">{{ nombre }}.</span>
      </h2>
    </div>

    <!-- 🔹 Resumen de Reservas -->
    <div class="grid grid-cols-2 gap-6 my-6">
      <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p class="text-2xl font-bold">{{ reservasActivas.length }}</p>
        <p class="text-lg">Reservas Activas</p>
      </div>
      <div class="bg-gray-700 text-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <p class="text-2xl font-bold">{{ reservasPasadas.length }}</p>
        <p class="text-lg">Reservas Pasadas</p>
      </div>
    </div>

    <!-- 🔹 Lista de Próximas Reservas -->
    <h2 class="text-2xl font-bold my-4">📅 Próximas Reservas</h2>
    <div v-if="reservasActivas.length" class="bg-gray-900 text-white rounded-lg p-6">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="pb-3">Restaurante</th>
            <th class="pb-3">Fecha</th>
            <th class="pb-3">Hora</th>
            <th class="pb-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservasActivas" :key="reserva.id" class="border-t border-gray-700">
            <td class="py-3">{{ reserva.restaurante }}</td>
            <td>{{ reserva.fecha }}</td>
            <td>{{ reserva.hora }}</td>
            <td class="space-x-3">
              <button class="text-blue-400"><i class="fas fa-edit"></i></button>
              <button class="text-red-400" @click="cancelarReserva(reserva.id)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 mt-3">No tienes reservas activas.</p>

    <!-- 🔹 Sección de Restaurantes Favoritos -->
    <h2 class="text-2xl font-bold my-4">❤️ Restaurantes Favoritos</h2>
    <div class="flex gap-4 overflow-x-auto">
      <div
        v-for="favorito in restaurantesFavoritos"
        :key="favorito.id"
        class="bg-gray-900 text-white p-4 rounded-lg shadow-lg w-56"
      >
        <img
          :src="favorito.imagen"
          alt="Imagen del restaurante"
          class="rounded-lg h-28 w-full object-cover"
        />
        <h3 class="text-xl font-semibold mt-3">{{ favorito.nombre }}</h3>
        <p class="text-gray-400 text-sm">{{ favorito.giro }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()

const authStore = useAuthStore()
const nombre = computed(() => authStore.nombre)

// 🔹 Simulación de reservas activas y pasadas
const reservas = ref([
  { id: 1, restaurante: 'El Yucateco', fecha: '2025-03-20', hora: '19:00', activa: true },
  { id: 2, restaurante: 'Gerardos', fecha: '2025-03-15', hora: '18:30', activa: true },
  { id: 3, restaurante: 'Moka Cafetería', fecha: '2025-02-28', hora: '16:00', activa: false },
])

const reservasActivas = computed(() => reservas.value.filter((r) => r.activa))
const reservasPasadas = computed(() => reservas.value.filter((r) => !r.activa))

// 🔹 Restaurantes favoritos (simulados)
const restaurantesFavoritos = ref([
  {
    id: 1,
    nombre: 'El Yucateco',
    giro: 'Taquería',
    imagen: 'https://source.unsplash.com/400x300/?restaurant',
  },
  {
    id: 2,
    nombre: 'Moka Cafetería',
    giro: 'Cafetería',
    imagen: 'https://source.unsplash.com/400x300/?cafe',
  },
  {
    id: 3,
    nombre: 'Gerardos',
    giro: 'Pizzería',
    imagen: 'https://source.unsplash.com/400x300/?pizza',
  },
])

// 🔹 Cancelar reserva
const cancelarReserva = (id) => {
  reservas.value = reservas.value.filter((r) => r.id !== id)
}
</script>
