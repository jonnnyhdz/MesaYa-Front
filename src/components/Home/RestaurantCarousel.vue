<template>
  <div class="relative w-full max-w-6xl mx-auto py-4">
    <h2 class="text-4xl font-bold text-gray-900 mb-10">Explora los mejores restaurantes</h2>

    <div
      class="relative overflow-hidden min-h-[450px]"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
      @wheel.prevent="handleWheel"
    >
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{
          transform: `translateX(-${currentIndex * 100}%)`,
          justifyContent: currentIndex === maxIndex && lastGroupNotFull ? 'flex-start' : 'unset',
        }"
      >
        <div
          v-for="(restaurantChunk, chunkIndex) in chunkedRestaurants"
          :key="chunkIndex"
          class="flex min-w-full space-x-4"
        >
          <RestaurantCard
            v-for="restaurant in restaurantChunk"
            :key="restaurant.id"
            :restaurant="restaurant"
          />
        </div>
      </div>

      <button
        v-if="currentIndex > 0"
        @click="prevSlide"
        class="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300"
      >
        ◀
      </button>

      <button
        v-if="currentIndex < maxIndex"
        @click="nextSlide"
        class="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-md hover:bg-gray-700 transition-all duration-300"
      >
        ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RestaurantCard from '@/components/Home/RestaurantCard.vue'

const restaurants = ref([
  {
    id: 1,
    name: 'La Buena Vida',
    image: 'https://source.unsplash.com/400x300/?restaurant',
    rating: 4.5,
    description: 'Un restaurante con mariscos frescos.',
    category: 'Mexicana',
    address: 'Av. Bonampak 123, Cancún',
    hours: '12:00 PM - 11:00 PM',
  },
  {
    id: 2,
    name: 'Trattoria Italiana',
    image: 'https://source.unsplash.com/400x300/?italian-food',
    rating: 4.8,
    description: 'Auténtica comida italiana.',
    category: 'Italiana',
    address: 'Blvd. Kukulcán Km 9, Cancún',
    hours: '1:00 PM - 10:00 PM',
  },
  {
    id: 3,
    name: 'Sushi House',
    image: 'https://source.unsplash.com/400x300/?sushi',
    rating: 4.6,
    description: 'Sushi de alta calidad.',
    category: 'Japonesa',
    address: 'Plaza La Isla, Cancún',
    hours: '2:00 PM - 12:00 AM',
  },
  {
    id: 4,
    name: 'Steak & Wine',
    image: 'https://source.unsplash.com/400x300/?steak',
    rating: 4.9,
    description: 'Cortes de carne premium.',
    category: 'Parrilla',
    address: 'Centro, Cancún',
    hours: '1:00 PM - 11:00 PM',
  },
  {
    id: 5,
    name: 'Vegan Delight',
    image: 'https://source.unsplash.com/400x300/?vegan-food',
    rating: 4.7,
    description: 'Comida vegana innovadora.',
    category: 'Vegana',
    address: 'Plaza Hollywood, Cancún',
    hours: '12:00 PM - 9:00 PM',
  },
  {
    id: 6,
    name: 'French Bistro',
    image: 'https://source.unsplash.com/400x300/?french-food',
    rating: 4.6,
    description: 'Auténtica comida francesa.',
    category: 'Francesa',
    address: 'Av. Tulum, Cancún',
    hours: '11:00 AM - 10:00 PM',
  },
  {
    id: 7,
    name: 'Pizzeria Napoli',
    image: 'https://source.unsplash.com/400x300/?pizza',
    rating: 4.8,
    description: 'La mejor pizza napolitana.',
    category: 'Italiana',
    address: 'Centro, Cancún',
    hours: '12:00 PM - 11:00 PM',
  },
  {
    id: 8,
    name: 'Pizzeria Napoli',
    image: 'https://source.unsplash.com/400x300/?pizza',
    rating: 4.8,
    description: 'La mejor pizza napolitana.',
    category: 'Italiana',
    address: 'Centro, Cancún',
    hours: '12:00 PM - 11:00 PM',
  },
  {
    id: 9,
    name: 'Pizzeria Napoli',
    image: 'https://source.unsplash.com/400x300/?pizza',
    rating: 4.8,
    description: 'La mejor pizza napolitana.',
    category: 'Italiana',
    address: 'Centro, Cancún',
    hours: '12:00 PM - 11:00 PM',
  },
  {
    id: 10,
    name: 'Pizzeria Napoli',
    image: 'https://source.unsplash.com/400x300/?pizza',
    rating: 4.8,
    description: 'La mejor pizza napolitana.',
    category: 'Italiana',
    address: 'Centro, Cancún',
    hours: '12:00 PM - 11:00 PM',
  },
  {
    id: 11,
    name: 'Pizzeria Napoli',
    image: 'https://source.unsplash.com/400x300/?pizza',
    rating: 4.8,
    description: 'La mejor pizza napolitana.',
    category: 'Italiana',
    address: 'Centro, Cancún',
    hours: '12:00 PM - 11:00 PM',
  },
])

const itemsPerPage = 5

// Divide la lista en grupos de 5
const chunkedRestaurants = computed(() => {
  const chunked = []
  for (let i = 0; i < restaurants.value.length; i += itemsPerPage) {
    chunked.push(restaurants.value.slice(i, i + itemsPerPage))
  }
  return chunked
})

const currentIndex = ref(0)
const maxIndex = computed(() => chunkedRestaurants.value.length - 1)

const lastGroupNotFull = computed(
  () => chunkedRestaurants.value[maxIndex.value]?.length < itemsPerPage,
)

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
