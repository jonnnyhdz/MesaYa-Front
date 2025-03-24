<template>
  <div class="p-8 animate-fadeIn">
    <!-- Encabezado -->
    <h1 class="text-xl italic font-semibold text-gray-900 dark:text-white mb-6">
      Bienvenido, <span class="italic font-light">{{ nombre }}</span> 👋
    </h1>

    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Restaurantes -->
      <div
        class="bg-white border border-gray-100 dark:bg-gray-900 shadow-lg rounded-lg p-6 transition-transform duration-300 hover:scale-105"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Restaurantes</h2>
          <i class="fas fa-utensils text-2xl text-green-600"></i>
        </div>
        <p class="text-4xl font-bold text-gray-800 dark:text-white">
          {{ restaurantes.length }}
        </p>
      </div>

      <!-- Colaboradores (Hostess) -->
      <div
        class="bg-white border border-gray-100 dark:bg-gray-900 shadow-lg rounded-lg p-6 transition-transform duration-300 hover:scale-105"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Colaboradores</h2>
          <i class="fas fa-users text-2xl text-blue-600"></i>
        </div>
        <p class="text-4xl font-bold text-gray-800 dark:text-white">
          {{ colaboradoresCount }}
        </p>
      </div>

      <!-- Mensajes -->
      <div
        class="bg-white border border-gray-100 dark:bg-gray-900 shadow-lg rounded-lg p-6 transition-transform duration-300 hover:scale-105"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Mensajes</h2>
          <i class="fas fa-envelope text-2xl text-purple-600"></i>
        </div>
        <p class="text-sm text-gray-800 dark:text-white">Enviados: 15 | Recibidos: 15</p>
      </div>
    </div>

    <!-- Restaurantes Destacados -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <!-- Restaurante con más Reservas -->
      <div
        class="bg-blue-500 text-white shadow-lg rounded-lg p-6 flex justify-between items-center transition-transform duration-300 hover:scale-105"
      >
        <div>
          <h3 class="text-md font-medium">Restaurante con más Reservas:</h3>
          <h2 class="text-xl font-semibold">{{ topRestaurante.nombre }}</h2>
          <p class="mt-1">{{ topRestaurante.reservas }} Reservas</p>
        </div>
        <img
          :src="topRestaurante.imagen"
          alt="Restaurante"
          class="w-24 h-24 rounded-lg object-cover"
        />
      </div>

      <!-- Restaurante con menos Reservas -->
      <div
        class="bg-gray-700 text-white shadow-lg rounded-lg p-6 flex justify-between items-center transition-transform duration-300 hover:scale-105"
      >
        <div>
          <h3 class="text-md font-medium">Restaurante con menos Reservas:</h3>
          <h2 class="text-xl font-semibold">{{ lowRestaurante.nombre }}</h2>
          <p class="mt-1">{{ lowRestaurante.reservas }} Reservas</p>
        </div>
        <img
          :src="lowRestaurante.imagen"
          alt="Restaurante"
          class="w-24 h-24 rounded-lg object-cover"
        />
      </div>
    </div>

    <!-- Tabla de Restaurantes en Gestión -->
    <div
      class="mt-4 bg-white border border-gray-100 dark:bg-gray-900 shadow-lg rounded-lg p-6 overflow-x-auto"
    >
      <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Restaurantes en Gestión</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr
            class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 uppercase text-sm font-semibold"
          >
            <th class="py-3 px-4 text-left">#</th>
            <th class="py-3 px-4 text-left">Nombre</th>
            <th class="py-3 px-4 text-left">Reservas</th>
            <th class="py-3 px-4 text-left">Encargado</th>
            <th class="py-3 px-4 text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(restaurante, index) in restaurantes"
            :key="restaurante.id"
            class="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <td class="py-4 px-4">
              {{ index + 1 }}
            </td>
            <td class="py-4 px-4 font-semibold text-gray-900 dark:text-white">
              {{ restaurante.nombre }}
            </td>
            <td class="py-4 px-4 text-gray-800 dark:text-white">
              {{ restaurante.reservas }}
            </td>
            <td class="py-4 px-4 text-gray-700 dark:text-gray-300">
              {{ restaurante.encargado }}
            </td>
            <td class="py-4 px-4 text-center">
              <span
                :class="restaurantEstadoClass(restaurante.estado)"
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ restaurante.estado }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Botón "Ver más" -->
      <div class="flex justify-end mt-4">
        <router-link
          to="/restaurantes-admin"
          class="bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 transition-all"
        >
          Ver más
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const restaurantStore = useRestaurantStore()
const userStore = useUserStore()
const router = useRouter()

// Nombre del administrador
const nombre = computed(() => authStore.nombre)

// Restaurantes (datos reales desde la BD)
const restaurantes = computed(() => restaurantStore.restaurants)

// Restaurante con más Reservas
const topRestaurante = computed(() => {
  if (!restaurantStore.restaurants.length) return {}
  return restaurantStore.restaurants.reduce(
    (max, item) => (item.reservas > max.reservas ? item : max),
    restaurantStore.restaurants[0],
  )
})

// Restaurante con menos Reservas
const lowRestaurante = computed(() => {
  if (!restaurantStore.restaurants.length) return {}
  return restaurantStore.restaurants.reduce(
    (min, item) => (item.reservas < min.reservas ? item : min),
    restaurantStore.restaurants[0],
  )
})

// Cantidad real de usuarios Hostess
const colaboradoresCount = computed(() => userStore.hostessUsers.length)

// Método para asignar clases según el estado del restaurante
const restaurantEstadoClass = (estado) => {
  return estado === 'Abierto' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
}

// Cargar datos al montar el componente
onMounted(() => {
  restaurantStore.fetchRestaurants()
  userStore.fetchHostessUsers()
})
</script>

<style scoped>
/* Animación de Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
</style>
