<template>
  <div class="bg-yellow-50">
    <div class="max-w-6xl mx-auto py-5">
      <div class="mb-10">
        <h2 class="text-4xl font-bold text-gray-900 flex items-center gap-2">
          <span>Restaurantes Cercanos</span>
        </h2>
        <p class="text-gray-600 text-lg mt-2">
          Encuentra los mejores restaurantes cerca de ti y haz tu reservación en segundos.
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-4 mb-6">
        <select v-model="selectedCategory" class="p-3 border rounded-md shadow-md bg-white">
          <option value="">Todas las categorías</option>
          <option v-for="category in categories" :key="category" :value="category">
            🍽️ {{ category }}
          </option>
        </select>

        <select v-model="selectedRating" class="p-3 border rounded-md shadow-md bg-white">
          <option value="">Todas las calificaciones</option>
          <option v-for="n in 5" :key="n" :value="n">⭐ {{ n }} estrellas</option>
        </select>

        <button
          @click="resetFilters"
          class="bg-blue-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          🔄 Resetear
        </button>
      </div>

      <div
        id="map"
        class="w-full h-[450px] rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 📍 Lista de Restaurantes con Coordenadas
const restaurants = ref([
  {
    id: 1,
    name: 'La Buena Vida',
    category: 'Mexicana',
    image: 'https://source.unsplash.com/400x300/?restaurant',
    rating: 5,
    lat: 21.1606,
    lng: -86.8475,
  },
  {
    id: 2,
    name: 'Trattoria Italiana',
    category: 'Italiana',
    image: 'https://source.unsplash.com/400x300/?italian-food',
    rating: 4,
    lat: 21.1612,
    lng: -86.8493,
  },
  {
    id: 3,
    name: 'Sushi House',
    category: 'Japonesa',
    image: 'https://source.unsplash.com/400x300/?sushi',
    rating: 5,
    lat: 21.1618,
    lng: -86.8429,
  },
  {
    id: 4,
    name: 'Steak & Wine',
    category: 'Parrilla',
    image: 'https://source.unsplash.com/400x300/?steak',
    rating: 5,
    lat: 21.1584,
    lng: -86.8417,
  },
])

// 📌 Filtros
const selectedCategory = ref('')
const selectedRating = ref('')

// 📍 Obtener Categorías Disponibles
const categories = ref([...new Set(restaurants.value.map((r) => r.category))])

// 📍 Ubicación del Usuario
const userLocation = ref({ lat: 21.1619, lng: -86.8515 }) // Predeterminado en Cancún

// 📍 Variables del Mapa
let map
let markers = []

// 📍 Inicializar Mapa
onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        loadMap()
      },
      () => {
        console.warn('No se pudo obtener la ubicación, usando valores predeterminados.')
        loadMap()
      },
    )
  } else {
    loadMap()
  }
})

// 📍 Cargar Mapa con OpenStreetMap
const loadMap = () => {
  map = L.map('map').setView([userLocation.value.lat, userLocation.value.lng], 14)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  addMarkers()
}

// 📍 Agregar Pines con Iconos Personalizados
const addMarkers = () => {
  markers.forEach((marker) => marker.remove())
  markers = []

  restaurants.value.forEach((restaurant) => {
    if (
      (selectedCategory.value && restaurant.category !== selectedCategory.value) ||
      (selectedRating.value && restaurant.rating !== selectedRating.value)
    ) {
      return
    }

    const customIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Ícono de mapa
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
    })

    const marker = L.marker([restaurant.lat, restaurant.lng], { icon: customIcon }).addTo(map)

    marker.bindPopup(`
      <div style="text-align: center;">
        <img src="${restaurant.image}" style="width: 120px; height: 80px; border-radius: 8px; margin-bottom: 5px;">
        <p><strong>${restaurant.name}</strong></p>
        <p>${restaurant.category}</p>
        <p style="color: gold;">${'⭐'.repeat(restaurant.rating)}</p>
        <a href="/restaurant/${restaurant.id}" class="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
          📅 Reservar
        </a>
      </div>
    `)

    markers.push(marker)
  })
}

// 📌 Resetear Filtros
const resetFilters = () => {
  selectedCategory.value = ''
  selectedRating.value = ''
  addMarkers()
}

// 📌 Escuchar cambios en filtros
watch([selectedCategory, selectedRating], () => {
  addMarkers()
})
</script>

<style>
/* 📍 Animaciones */
#map {
  transition: transform 0.3s ease-in-out;
}
</style>
