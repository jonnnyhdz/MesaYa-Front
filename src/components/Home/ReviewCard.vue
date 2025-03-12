<template>
  <div
    class="bg-white shadow-lg rounded-lg p-6 w-[320px] min-h-[240px] flex flex-col justify-between transition-all duration-300 transform hover:rotate-y-6 hover:shadow-2xl"
  >
    <div class="flex items-center space-x-4">
      <img :src="review.image" alt="Usuario" class="w-12 h-12 rounded-full shadow-md" />
      <div>
        <p class="font-bold text-gray-900">{{ review.user }}</p>
        <span class="text-yellow-500"
          >{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</span
        >
      </div>
    </div>
    <p class="text-gray-600 mt-3 text-sm italic">"{{ review.comment }}"</p>
  </div>
</template>

<script setup>
defineProps({ review: Object })
</script>
