<template>
  <div class="max-w-6xl mx-auto py-16">
    <h2 class="text-4xl font-bold text-gray-900 mb-10 flex items-center">
      Promociones y Descuentos Exclusivos
    </h2>

    <div class="flex justify-center gap-4 mb-6">
      <select v-model="selectedCategory" class="p-3 border rounded-md shadow-md bg-white">
        <option value="">Todas las categorías</option>
        <option v-for="category in categories" :key="category" :value="category">
          🍽️ {{ category }}
        </option>
      </select>
      <button
        @click="resetFilters"
        class="bg-blue-500 text-white px-5 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
      >
        🔄 Resetear
      </button>
    </div>

    <div
      class="relative overflow-hidden w-full min-h-[450px] transition-all duration-300 hover:scale-[1.02]"
    >
      <div
        class="flex transition-transform duration-500 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(discountChunk, chunkIndex) in chunkedDiscounts"
          :key="chunkIndex"
          class="flex min-w-full space-x-4"
        >
          <DiscountCard v-for="discount in discountChunk" :key="discount.id" :discount="discount" />
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
import DiscountCard from '@/components/Home/DiscountCard.vue'

// 📌 Lista de Promociones
const discounts = ref([
  {
    id: 1,
    restaurant: 'La Buena Vida',
    category: 'Mexicana',
    image: 'https://source.unsplash.com/400x300/?mexican-food',
    discount: 20,
    expiresIn: 3600, // 1 hora en segundos
  },
  {
    id: 2,
    restaurant: 'Trattoria Italiana',
    category: 'Italiana',
    image: 'https://source.unsplash.com/400x300/?italian-food',
    discount: 30,
    expiresIn: 7200, // 2 horas
  },
  {
    id: 3,
    restaurant: 'Sushi House',
    category: 'Japonesa',
    image: 'https://source.unsplash.com/400x300/?sushi',
    discount: 25,
    expiresIn: 5400, // 1.5 horas
  },
  {
    id: 4,
    restaurant: 'Steak & Wine',
    category: 'Parrilla',
    image: 'https://source.unsplash.com/400x300/?steak',
    discount: 15,
    expiresIn: 4500,
  },
  {
    id: 3,
    restaurant: 'Sushi House',
    category: 'Japonesa',
    image: 'https://source.unsplash.com/400x300/?sushi',
    discount: 25,
    expiresIn: 5400, // 1.5 horas
  },
  {
    id: 4,
    restaurant: 'Steak & Wine',
    category: 'Parrilla',
    image: 'https://source.unsplash.com/400x300/?steak',
    discount: 15,
    expiresIn: 4500,
  },
  {
    id: 3,
    restaurant: 'Sushi House',
    category: 'Japonesa',
    image: 'https://source.unsplash.com/400x300/?sushi',
    discount: 25,
    expiresIn: 5400, // 1.5 horas
  },
  {
    id: 4,
    restaurant: 'Steak & Wine',
    category: 'Parrilla',
    image: 'https://source.unsplash.com/400x300/?steak',
    discount: 15,
    expiresIn: 4500,
  },
  {
    id: 3,
    restaurant: 'Sushi House',
    category: 'Japonesa',
    image: 'https://source.unsplash.com/400x300/?sushi',
    discount: 25,
    expiresIn: 5400, // 1.5 horas
  },
  {
    id: 4,
    restaurant: 'Steak & Wine',
    category: 'Parrilla',
    image: 'https://source.unsplash.com/400x300/?steak',
    discount: 15,
    expiresIn: 4500,
  },
])

// 📌 Filtros de Categoría
const selectedCategory = ref('')
const categories = ref([...new Set(discounts.value.map((d) => d.category))])

// 📌 Función para Resetear Filtros
const resetFilters = () => {
  selectedCategory.value = ''
}

// 📌 Carrusel de Promociones (4 por vista)
const itemsPerPage = 4
const chunkedDiscounts = computed(() => {
  const chunked = []
  const filtered = selectedCategory.value
    ? discounts.value.filter((d) => d.category === selectedCategory.value)
    : discounts.value

  for (let i = 0; i < filtered.length; i += itemsPerPage) {
    chunked.push(filtered.slice(i, i + itemsPerPage))
  }
  return chunked
})

const currentIndex = ref(0)
const maxIndex = computed(() => chunkedDiscounts.value.length - 1)

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) currentIndex.value++
}
const prevSlide = () => {
  if (currentIndex.value > 0) currentIndex.value--
}
</script>
