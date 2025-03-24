<template>
  <div class="px-4 sm:px-8 lg:px-16 py-8 max-w-7xl mx-auto">
    <!-- Banner de bienvenida -->
    <div
      class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg mb-5 flex items-center justify-between"
    >
      <div>
        <h2 class="text-2xl sm:text-3xl font-bold mb-1">👋 Bienvenido, {{ nombre }}.</h2>
        <p class="text-sm sm:text-base opacity-90">
          Explora y reserva tu próxima experiencia culinaria
        </p>
      </div>
      <i class="fas fa-utensils text-4xl sm:text-5xl opacity-80"></i>
    </div>

    <!-- Sección: Restaurantes Disponibles -->
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Restaurantes Disponibles</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div
        v-for="restaurante in restaurantStore.restaurants"
        :key="restaurante.id"
        @click="verDetalles(restaurante.id)"
        class="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <img
          :src="restaurante.imagen || defaultImage"
          alt="Imagen del restaurante"
          class="w-full h-40 object-cover"
        />
        <div class="p-4 space-y-2">
          <h3 class="text-xl font-semibold text-gray-800">{{ restaurante.nombre }}</h3>
          <p class="text-sm text-gray-600 truncate">{{ restaurante.descripcion }}</p>
          <p class="text-sm text-gray-500">
            <i class="fas fa-map-marker-alt text-red-500 mr-1"></i>{{ restaurante.direccion }}
          </p>
          <p class="text-sm text-gray-500">
            <i class="fas fa-clock text-blue-500 mr-1"></i>{{ restaurante.horario }}
          </p>
          <span
            class="inline-block px-2 py-1 text-xs rounded-full"
            :class="
              restaurante.estado === 'Abierto'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            "
          >
            {{ restaurante.estado }}
          </span>
        </div>
      </div>
    </div>

    <!-- Sección: Menús destacados -->
    <h2 class="text-2xl font-bold mb-4 text-gray-800">🔥 Menús Destacados</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="menu in topMenus"
        :key="menu.id"
        class="bg-gray-100 rounded-lg p-4 shadow hover:shadow-md transition"
      >
        <h4 class="text-lg font-semibold text-gray-800">{{ menu.nombreItem }}</h4>
        <p class="text-sm text-gray-600 line-clamp-2">{{ menu.descripcion }}</p>
        <p class="text-blue-500 font-bold mt-2">💰 ${{ menu.precio }}</p>
        <p class="text-sm text-gray-500 mt-1">
          Restaurante: {{ getNombreRestaurante(menu.restauranteId) }}
        </p>
      </div>
    </div>

    <!-- Sección: Categorías de menú -->
    <h2 class="text-2xl font-bold mb-4 text-gray-800">🍴 Categorías de Menú</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="cat in menuStore.categories"
        :key="cat.id"
        class="relative rounded-xl shadow-lg overflow-hidden group h-40"
      >
        <!-- Imagen de fondo -->
        <img
          :src="obtenerImagenCategoria(cat.nombre)"
          alt="Imagen categoría"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <!-- Capa degradada para mejorar visibilidad del texto -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <!-- Nombre de la categoría -->
        <div class="absolute bottom-3 left-4 z-10">
          <h3 class="text-white text-xl font-semibold drop-shadow-md">{{ cat.nombre }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { useMenuStore } from '@/stores/menuStore'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const nombre = computed(() => authStore.nombre)

const restaurantStore = useRestaurantStore()
const menuStore = useMenuStore()
const defaultImage = 'https://source.unsplash.com/400x300/?restaurant'

// Redirigir a detalles del restaurante
const verDetalles = (id: number) => {
  router.push(`/restaurant/${id}`)
}

// Imagen dinámica por categoría
const obtenerImagenCategoria = (nombre: string): string => {
  const nombreLower = nombre.toLowerCase()

  if (nombreLower.includes('bebida')) {
    return 'https://images.unsplash.com/photo-1571805612604-5f95b52698e1?auto=format&fit=crop&w=800&q=80'
  }
  if (nombreLower.includes('postre')) {
    return 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80'
  }
  if (nombreLower.includes('carne')) {
    return 'https://images.unsplash.com/photo-1607290817800-03b3c9ba8849?auto=format&fit=crop&w=800&q=80'
  }
  if (nombreLower.includes('ensalada')) {
    return 'https://images.unsplash.com/photo-1604908176834-6e3c7cb9efc3?auto=format&fit=crop&w=800&q=80'
  }
  if (nombreLower.includes('pasta')) {
    return 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=800&q=80'
  }
  if (nombreLower.includes('marisco')) {
    return 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80'
  }
  if (nombreLower.includes('sopa')) {
    return 'https://images.unsplash.com/photo-1571091655789-42dcb5215b77?auto=format&fit=crop&w=800&q=80'
  }

  return 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80'
}

// Cargar datos
onMounted(async () => {
  await restaurantStore.fetchRestaurants()
  await menuStore.fetchCategories()

  for (const restaurante of restaurantStore.restaurants) {
    await menuStore.fetchMenusByRestaurantId(restaurante.id)
  }
})

// Menús destacados (top 3 por precio)
const topMenus = computed(() =>
  [...menuStore.menus].sort((a, b) => b.precio - a.precio).slice(0, 3),
)

// Nombre del restaurante por ID
const getNombreRestaurante = (id: number): string => {
  const restaurante = restaurantStore.restaurants.find((r) => r.id === id)
  return restaurante?.nombre || 'Desconocido'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
