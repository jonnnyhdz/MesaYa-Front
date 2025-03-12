<template>
  <div
    class="bg-white border-gray-100 shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl w-[20%] flex-shrink-0 min-h-[320px] flex flex-col"
  >
    <img :src="restaurant.image" alt="Imagen del restaurante" class="w-full h-40 object-cover" />
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
        class="mt-3 inline-block px-2 py-2 bg-blue-500 text-center text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
      >
        Ver Detalles
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  restaurant: Object,
})
</script>

<style>
.group {
  min-height: 320px;
  max-height: 320px;
}

.group:hover {
  position: relative;
  z-index: 10;
}
</style>
