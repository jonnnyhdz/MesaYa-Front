<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div v-if="restaurant" class="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="relative">
        <img
          :src="restaurant.images[currentImage]"
          class="w-full h-96 object-cover transition-opacity duration-500"
        />
        <button
          v-if="currentImage > 0"
          @click="prevImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          ◀
        </button>
        <button
          v-if="currentImage < restaurant.images.length - 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700"
        >
          ▶
        </button>
      </div>

      <div class="p-6">
        <h1 class="text-4xl font-bold">{{ restaurant.name }}</h1>
        <p class="text-gray-700 mt-2">{{ restaurant.description }}</p>
        <div class="mt-4 flex items-center">
          <span class="text-yellow-500 text-lg font-bold">{{ restaurant.rating }} ★</span>
          <span class="ml-3 text-gray-600">{{ restaurant.reviews?.length || 0 }} Reseñas</span>
        </div>

        <div v-if="restaurant.hours?.length" class="mt-6">
          <h3 class="text-xl font-semibold">Selecciona un horario:</h3>
          <div class="mt-3 flex flex-wrap gap-3">
            <button
              v-for="(hour, index) in restaurant.hours"
              :key="index"
              @click="selectedHour = hour"
              class="px-4 py-2 rounded-lg transition-all duration-300"
              :class="{
                'bg-blue-500 text-white': selectedHour === hour,
                'bg-gray-200 text-gray-800 hover:bg-gray-300': selectedHour !== hour,
              }"
            >
              {{ hour }}
            </button>
          </div>
        </div>

        <button
          @click="reserveTable"
          class="mt-6 w-full py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition-all"
        >
          Reservar Mesa
        </button>

        <div class="mt-8">
          <h3 class="text-xl font-semibold">Ubicación</h3>
          <p class="text-gray-600">{{ restaurant.address }}</p>
          <iframe
            v-if="restaurant.map"
            :src="restaurant.map"
            width="100%"
            height="300"
            class="mt-3 rounded-lg"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-700 text-xl font-bold">
      <p>❌ Restaurante no encontrado.</p>
      <router-link to="/" class="text-blue-500 underline">Volver a la página principal</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const restaurant = ref(null)
const currentImage = ref(0)
const selectedHour = ref(null)

const fetchRestaurantData = async (id) => {
  try {
    const response = await fetch(`https://api.example.com/restaurants/${id}`)
    if (!response.ok) throw new Error('No se encontró el restaurante')

    restaurant.value = await response.json()
  } catch (error) {
    console.error('Error al obtener el restaurante:', error)
    restaurant.value = null
  }
}

onMounted(() => {
  fetchRestaurantData(route.params.id)
})

const nextImage = () => {
  if (currentImage.value < restaurant.value.images.length - 1) currentImage.value++
}
const prevImage = () => {
  if (currentImage.value > 0) currentImage.value--
}

const reserveTable = () => {
  if (!selectedHour.value) return alert('Selecciona un horario para continuar.')
  alert(`Mesa reservada a las ${selectedHour.value}.`)
}
</script>
