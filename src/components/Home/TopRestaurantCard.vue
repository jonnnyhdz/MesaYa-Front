<template>
  <div
    class="relative bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl w-[22%] flex-shrink-0 min-h-[350px] flex flex-col"
  >
    <span
      class="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider"
    >
      Top
    </span>

    <img :src="restaurant.image" alt="Imagen del restaurante" class="w-full h-48 object-cover" />

    <div class="p-4 flex flex-col flex-grow">
      <h3 class="text-lg font-bold text-gray-900">{{ restaurant.name }}</h3>
      <p class="text-gray-600 text-sm mt-1 flex-grow">{{ restaurant.description }}</p>
      <div class="flex items-center mt-2">
        <span class="text-yellow-500 text-sm font-bold">{{ restaurant.rating }} ★</span>
        <span class="ml-2 px-2 py-1 text-xs font-semibold bg-gray-200 rounded-full">{{
          restaurant.category
        }}</span>
      </div>
      <router-link
        :to="{ name: 'restaurantDetails', params: { id: restaurant.id } }"
        class="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-center text-sm rounded-lg shadow-md hover:scale-105 transition-all duration-300"
      >
        Explorar 🔥
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: Object,
})
</script>
