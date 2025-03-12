<template>
  <div class="max-w-6xl mx-auto py-16">
    <h2 class="text-4xl font-bold text-gray-900 mb-10">Categorías Populares</h2>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="category in categories"
        :key="category.id"
        class="relative group rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-105"
      >
        <img
          :src="category.image"
          alt="Categoría de comida"
          class="w-full h-40 object-cover brightness-75 transition-all duration-300"
        />

        <div
          class="absolute inset-0 mt-6 flex flex-col items-center justify-center text-black text-lg font-bold"
        >
          <p class="bg-white px-4 py-1 rounded-lg shadow-md">{{ category.name }}</p>
          <p class="text-sm font-semibold opacity-75 mt-1">{{ category.count }} restaurantes</p>
        </div>

        <router-link
          :to="'/search?category=' + category.slug"
          class="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-white text-sm px-5 py-2 rounded-full shadow-lg transition-all duration-300"
          :class="'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'"
        >
          Explorar más
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Imágenes de referencia
const categories = ref([
  {
    id: 1,
    name: 'Mexicana',
    slug: 'mexicana',
    image: 'https://images.pexels.com/photos/4686826/pexels-photo-4686826.jpeg',
    count: 25,
  },
  {
    id: 2,
    name: 'Italiana',
    slug: 'italiana',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
    count: 18,
  },
  {
    id: 3,
    name: 'Japonesa',
    slug: 'japonesa',
    image: 'https://images.pexels.com/photos/1160879/pexels-photo-1160879.jpeg',
    count: 12,
  },
  {
    id: 4,
    name: 'Parrilla',
    slug: 'parrilla',
    image: 'https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg',
    count: 15,
  },
  {
    id: 5,
    name: 'Vegana',
    slug: 'vegana',
    image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    count: 9,
  },
  {
    id: 6,
    name: 'Francesa',
    slug: 'francesa',
    image: 'https://images.pexels.com/photos/4686826/pexels-photo-4686826.jpeg',
    count: 8,
  },
  {
    id: 7,
    name: 'Mariscos',
    slug: 'mariscos',
    image: 'https://images.pexels.com/photos/128388/pexels-photo-128388.jpeg',
    count: 20,
  },
  {
    id: 8,
    name: 'Postres',
    slug: 'postres',
    image: 'https://images.pexels.com/photos/302681/pexels-photo-302681.jpeg',
    count: 14,
  },
])
</script>
