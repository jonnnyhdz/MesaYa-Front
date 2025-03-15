<template>
  <div class="p-8">
    <!-- 📌 Encabezado principal con contadores -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Gestión de Restaurantes</h2>

      <!-- 📌 Contadores en el centro -->
      <div class="flex items-center space-x-6 text-sm text-gray-700 dark:text-gray-300">
        <span class="px-3 py-1 bg-green-200 text-green-900 rounded-full">
          Total Abiertos: {{ totalAbiertos }}
        </span>
        <span class="px-3 py-1 bg-red-200 text-red-900 rounded-full">
          Total Cerrados: {{ totalCerrados }}
        </span>
      </div>

      <button
        class="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-all mb-2"
      >
        + Agregar
      </button>
    </div>

    <!-- 📌 Sección de Gestión de Restaurantes -->
    <div class="bg-gray-900 text-white rounded-lg p-6 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="pb-3">#</th>
            <th class="pb-3">Nombre</th>
            <th class="pb-3">Giro</th>
            <th class="pb-3">Reservas</th>
            <th class="pb-3">Calificación</th>
            <th class="pb-3">Encargado</th>
            <th class="pb-3">Estado</th>
            <th class="pb-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(restaurant, index) in restaurantes"
            :key="restaurant.id"
            class="border-t border-gray-700"
          >
            <td class="py-3">{{ index + 1 }}</td>
            <td>{{ restaurant.nombre }}</td>
            <td>{{ restaurant.giro }}</td>
            <td>{{ restaurant.reservas }}</td>
            <td>{{ restaurant.calificacion }} ⭐</td>
            <td>{{ restaurant.encargado }}</td>
            <td>
              <span
                :class="restaurant.estado === 'Abierto' ? 'text-green-500' : 'text-red-500'"
                class="font-semibold"
              >
                {{ restaurant.estado }}
              </span>
            </td>
            <td class="space-x-3">
              <button class="text-green-400"><i class="fas fa-edit"></i></button>
              <button class="text-red-400"><i class="fas fa-trash"></i></button>
              <button class="text-blue-400"><i class="fas fa-eye"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 📌 Sección de Restaurantes en Carrusel -->
    <div class="flex justify-between items-center my-3">
      <h2 class="text-2xl font-bold">Todos los Restaurantes</h2>

      <router-link
        to="/todos-restaurantes"
        class="text-blue-800 font-semibold underline px-4 py-2 hover:text-blue-600 transition-all"
      >
        Ver Todos
      </router-link>
    </div>

    <div class="relative">
      <button
        @click="prevSlide"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="overflow-hidden w-full">
        <div
          class="flex transition-transform duration-300"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="restaurant in visibleRestaurants"
            :key="restaurant.id"
            class="bg-gray-900 text-white p-4 rounded-lg shadow-lg mx-2 flex-shrink-0 w-[23.5%]"
          >
            <img
              :src="restaurant.imagen"
              alt="Imagen del restaurante"
              class="rounded-lg h-40 w-full object-cover"
            />
            <h3 class="text-xl font-semibold mt-3">{{ restaurant.nombre }}</h3>
            <p class="text-gray-400 text-sm">{{ restaurant.giro }}</p>
            <p class="text-gray-300 text-sm mt-2">{{ restaurant.descripcion }}</p>
          </div>
        </div>
      </div>

      <button
        @click="nextSlide"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full z-10"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const restaurantes = ref([
  {
    id: 1,
    nombre: 'El Yucateco',
    giro: 'Taquería',
    reservas: 10,
    calificacion: 4.9,
    encargado: 'Jonathan Hernandez',
    estado: 'Abierto',
    imagen: 'https://source.unsplash.com/400x300/?restaurant',
    descripcion: 'Ofrecemos tacos y comida Yucateca...',
  },
  {
    id: 2,
    nombre: 'Moka Cafetería',
    giro: 'Cafetería',
    reservas: 11,
    calificacion: 4.2,
    encargado: 'Daniel Tuz',
    estado: 'Cerrado',
    imagen: 'https://source.unsplash.com/400x300/?cafe',
    descripcion: 'Especializados en café y postres...',
  },
  {
    id: 3,
    nombre: 'Gerardos',
    giro: 'Pizzería',
    reservas: 12,
    calificacion: 4.0,
    encargado: 'Guillermo Garcia',
    estado: 'Abierto',
    imagen: 'https://source.unsplash.com/400x300/?pizza',
    descripcion: 'Las mejores pizzas artesanales...',
  },
  {
    id: 4,
    nombre: 'Chester’s',
    giro: 'Pizza y Pasta',
    reservas: 13,
    calificacion: 3.6,
    encargado: 'Cristian Lopez',
    estado: 'Cerrado',
    imagen: 'https://source.unsplash.com/400x300/?pasta',
    descripcion: 'Comida italiana deliciosa...',
  },
  {
    id: 5,
    nombre: 'La Campechana',
    giro: 'Marisquería',
    reservas: 14,
    calificacion: 2.0,
    encargado: 'Geovani Guzman',
    estado: 'Abierto',
    imagen: 'https://source.unsplash.com/400x300/?seafood',
    descripcion: 'Mariscos frescos de Campeche...',
  },
])

const currentSlide = ref(0)

const visibleRestaurants = computed(() =>
  restaurantes.value.slice(currentSlide.value, currentSlide.value + 4),
)

const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}

const nextSlide = () => {
  if (currentSlide.value < restaurantes.value.length - 4) currentSlide.value++
}

// 📌 Contadores de abiertos y cerrados
const totalAbiertos = computed(
  () => restaurantes.value.filter((r) => r.estado === 'Abierto').length,
)
const totalCerrados = computed(
  () => restaurantes.value.filter((r) => r.estado === 'Cerrado').length,
)
</script>
