<template>
  <div class="bg-yellow-50">
    <div class="relative w-full max-w-6xl mx-auto py-4">
      <h2 class="text-4xl font-bold text-gray-900 mb-10">Restaurantes Top 🔥</h2>

      <div
        class="relative overflow-hidden"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @wheel.prevent="handleWheel"
      >
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(restaurantChunk, chunkIndex) in chunkedRestaurants"
            :key="chunkIndex"
            class="flex min-w-full space-x-4 justify-center"
          >
            <TopRestaurantCard
              v-for="restaurant in restaurantChunk"
              :key="restaurant.id"
              :restaurant="restaurant"
            />
          </div>
        </div>

        <button
          v-if="currentIndex > 0"
          @click="prevSlide"
          class="absolute left-0 top-1/2 transform -translate-y-1/2 border border-gray-100 bg-white text-gray-800 px-5 py-3 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 z-10"
        >
          ◀
        </button>

        <button
          v-if="currentIndex < maxIndex"
          @click="nextSlide"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 border border-gray-100 bg-white text-gray-800 px-5 py-3 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 z-10"
        >
          ▶
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TopRestaurantCard from '@/components/Home/TopRestaurantCard.vue'

const topRestaurants = ref([
  {
    id: 1,
    name: 'La Buena Vida',
    image: 'https://source.unsplash.com/400x300/?restaurant',
    rating: 4.9,
    description: 'Mariscos frescos y un ambiente único.',
    category: 'Mexicana',
  },
  {
    id: 2,
    name: 'Trattoria Italiana',
    image: 'https://source.unsplash.com/400x300/?italian-food',
    rating: 4.8,
    description: 'Auténtica comida italiana con un toque moderno.',
    category: 'Italiana',
  },
  {
    id: 3,
    name: 'Sushi House',
    image: 'https://source.unsplash.com/400x300/?sushi',
    rating: 4.7,
    description: 'Experiencia japonesa con sushi premium.',
    category: 'Japonesa',
  },
  {
    id: 4,
    name: 'Steak & Wine',
    image: 'https://source.unsplash.com/400x300/?steak',
    rating: 4.9,
    description: 'Carnes selectas y una carta de vinos exclusiva.',
    category: 'Parrilla',
  },
  {
    id: 5,
    name: 'Vegan Delight',
    image: 'https://source.unsplash.com/400x300/?vegan-food',
    rating: 4.8,
    description: 'Platos veganos innovadores y saludables.',
    category: 'Vegana',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
  },
])

// Número de restaurantes por slide (4)
const itemsPerPage = 4

// Dividir la lista en grupos de 4
const chunkedRestaurants = computed(() => {
  const chunked = []
  for (let i = 0; i < topRestaurants.value.length; i += itemsPerPage) {
    chunked.push(topRestaurants.value.slice(i, i + itemsPerPage))
  }
  return chunked
})

const currentIndex = ref(0)
const maxIndex = computed(() => chunkedRestaurants.value.length - 1)

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>
