<template>
  <div class="min-h-screen dark:bg-gray-900 p-6">
    <!-- Bienvenida -->
    <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-200">
      Bienvenido, <span class="text-black dark:text-white font-extrabold">{{ nombre }}</span> 👋
    </h1>

    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Restaurantes</h2>
          <i class="fas fa-utensils text-2xl"></i>
        </div>
        <p class="text-4xl font-bold mt-2">{{ restaurantes.length }}</p>
      </div>

      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Colaboradores</h2>
          <i class="fas fa-users text-2xl"></i>
        </div>
        <p class="text-4xl font-bold mt-2">15</p>
      </div>

      <div class="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Mensajes</h2>
          <i class="fas fa-envelope text-2xl"></i>
        </div>
        <p class="text-sm mt-2">Enviados: 15 | Recibidos: 15</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Restaurante con más Reservas -->
      <div
        class="bg-blue-600 text-white p-6 rounded-lg shadow-md flex justify-between items-center"
      >
        <div>
          <h3 class="text-md">Restaurante con más Reservas:</h3>
          <h2 class="text-xl font-semibold">{{ topRestaurante.nombre }}</h2>
          <p>{{ topRestaurante.reservas }} Reservas</p>
        </div>
        <img :src="topRestaurante.imagen" alt="Restaurante" class="w-24 h-24 rounded-lg" />
      </div>

      <!-- Restaurante con menos Reservas -->
      <div
        class="bg-gray-700 text-white p-6 rounded-lg shadow-md flex justify-between items-center"
      >
        <div>
          <h3 class="text-md">Restaurante con menos Reservas:</h3>
          <h2 class="text-xl font-semibold">{{ lowRestaurante.nombre }}</h2>
          <p>{{ lowRestaurante.reservas }} Reservas</p>
        </div>
        <img :src="lowRestaurante.imagen" alt="Restaurante" class="w-24 h-24 rounded-lg" />
      </div>
    </div>

    <!-- Tabla de Restaurantes -->
    <div class="mt-6 bg-gray-800 text-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Restaurantes en Gestión</h2>
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-700">
            <th class="py-2 px-4">#</th>
            <th class="py-2 px-4">Nombre</th>
            <th class="py-2 px-4">Giro</th>
            <th class="py-2 px-4">Reservas</th>
            <th class="py-2 px-4">Calificación</th>
            <th class="py-2 px-4">Encargado</th>
            <th class="py-2 px-4">Estado</th>
            <th class="py-2 px-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(restaurante, index) in restaurantes"
            :key="index"
            class="border-b border-gray-700"
          >
            <td class="py-2 px-4">{{ index + 1 }}</td>
            <td class="py-2 px-4">{{ restaurante.nombre }}</td>
            <td class="py-2 px-4">{{ restaurante.giro }}</td>
            <td class="py-2 px-4">{{ restaurante.reservas }}</td>
            <td class="py-2 px-4 text-yellow-400">{{ restaurante.calificacion }} ⭐</td>
            <td class="py-2 px-4">{{ restaurante.encargado }}</td>
            <td class="py-2 px-4">
              <span
                class="px-3 py-1 rounded-lg"
                :class="{
                  'bg-green-500': restaurante.estado === 'Abierto',
                  'bg-red-500': restaurante.estado === 'Cerrado',
                }"
              >
                {{ restaurante.estado }}
              </span>
            </td>
            <td class="py-2 px-4">
              <button class="text-blue-400 hover:text-blue-300">
                <i class="fas fa-pencil-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const nombre = computed(() => authStore.nombre)

// Datos de ejemplo
const restaurantes = ref([
  {
    nombre: 'El Yucateco',
    giro: 'Taquería',
    reservas: 15,
    calificacion: 4.9,
    encargado: 'Jonathan Hernandez',
    estado: 'Abierto',
  },
  {
    nombre: 'Moka Cafetería',
    giro: 'Cafetería',
    reservas: 11,
    calificacion: 4.2,
    encargado: 'Daniel Tuz',
    estado: 'Cerrado',
  },
  {
    nombre: 'Gerardos',
    giro: 'Pizzería',
    reservas: 12,
    calificacion: 4.0,
    encargado: 'Guillermo Garcia',
    estado: 'Abierto',
  },
  {
    nombre: 'Chester’s',
    giro: 'Pizza y Pasta',
    reservas: 13,
    calificacion: 3.6,
    encargado: 'Cristian Lopez',
    estado: 'Cerrado',
  },
  {
    nombre: 'La Campechana',
    giro: 'Marisquería',
    reservas: 10,
    calificacion: 2.0,
    encargado: 'Geovani Guzman',
    estado: 'Abierto',
  },
])

const topRestaurante = computed(() =>
  restaurantes.value.reduce(
    (max, item) => (item.reservas > max.reservas ? item : max),
    restaurantes.value[0],
  ),
)
const lowRestaurante = computed(() =>
  restaurantes.value.reduce(
    (min, item) => (item.reservas < min.reservas ? item : min),
    restaurantes.value[0],
  ),
)
</script>
