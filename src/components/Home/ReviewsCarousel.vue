<template>
  <!-- <div class="bg-yellow-50"> -->
  <div class="max-w-6xl mx-auto py-16">
    <h2 class="text-4xl font-bold text-gray-900 mb-10">Reseñas Destacadas</h2>

    <div class="relative overflow-hidden">
      <div
        class="flex transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(reviewChunk, chunkIndex) in chunkedReviews"
          :key="chunkIndex"
          class="flex min-w-full space-x-6 justify-center"
        >
          <ReviewCard v-for="review in reviewChunk" :key="review.id" :review="review" />
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
      <!-- </div> -->

      <!-- Esto es por si se quiere implemnetar que el usuario agregue su reseña en el home -->

      <!-- Botón para agregar reseña
    <div class="flex justify-center mt-8">
      <button
        @click="openReviewModal"
        class="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition-all duration-300"
      >
        ✍️ Agregar Reseña
      </button>
    </div> -->
    </div>
  </div>

  <!-- Modal de Agregar Reseña -->
  <ReviewModal v-if="showModal" @close="showModal = false" @submit="addReview" />
</template>

<script setup>
import { ref, computed } from 'vue'
import ReviewCard from '@/components/Home/ReviewCard.vue'
//importacion del modal para que el usuario ponga su reseña, esta por ver
// import ReviewModal from '@/utils/ReviewModal.vue'

// Lista de reseñas
const reviews = ref([
  {
    id: 1,
    user: 'Carlos Pérez',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
    rating: 5,
    comment: '¡Increíble servicio y comida deliciosa! Definitivamente volveré.',
  },
  {
    id: 2,
    user: 'Ana López',
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 4,
    comment: 'El ambiente es hermoso, pero el servicio fue un poco lento.',
  },
  {
    id: 3,
    user: 'Fernando Torres',
    image: 'https://randomuser.me/api/portraits/men/20.jpg',
    rating: 5,
    comment: 'El mejor sushi que he probado en mi vida. 100% recomendado.',
  },
  {
    id: 4,
    user: 'Sofía Ramírez',
    image: 'https://randomuser.me/api/portraits/women/15.jpg',
    rating: 4,
    comment: 'Buena relación calidad-precio. Me encantó el lugar.',
  },
  {
    id: 5,
    user: 'Luis Martínez',
    image: 'https://randomuser.me/api/portraits/men/30.jpg',
    rating: 5,
    comment: 'Simplemente espectacular, la atención fue excelente.',
  },
  {
    id: 6,
    user: 'Mariana Gutiérrez',
    image: 'https://randomuser.me/api/portraits/women/25.jpg',
    rating: 5,
    comment: 'Uno de mis lugares favoritos. La comida es deliciosa.',
  },
])

const showModal = ref(false)
const openReviewModal = () => {
  showModal.value = true
}

const itemsPerPage = 3
const chunkedReviews = computed(() => {
  const chunked = []
  for (let i = 0; i < reviews.value.length; i += itemsPerPage) {
    chunked.push(reviews.value.slice(i, i + itemsPerPage))
  }
  return chunked
})

const currentIndex = ref(0)
const maxIndex = computed(() => chunkedReviews.value.length - 1)

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

const addReview = (newReview) => {
  reviews.value.unshift(newReview)
  showModal.value = false
}
</script>
