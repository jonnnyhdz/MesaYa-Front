<template>
  <div
    class="bg-white border border-gray-100 shadow-lg rounded-lg overflow-hidden transform transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl w-[22%] flex-shrink-0 min-h-[320px] flex flex-col relative"
  >
    <img :src="discount.image" alt="Imagen del restaurante" class="w-full h-40 object-cover" />

    <div
      class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-full"
    >
      -{{ discount.discount }}%
    </div>

    <div class="p-4 flex flex-col flex-grow">
      <h3 class="text-lg font-bold text-gray-900">{{ discount.restaurant }}</h3>
      <p class="text-gray-600 text-sm mt-1 flex-grow">Oferta en {{ discount.category }}</p>

      <!-- Temporizador -->
      <div class="mt-3 flex items-center space-x-2">
        <span class="text-red-500 font-semibold">⏳ {{ timeLeft }}</span>
      </div>

      <router-link
        :to="'/restaurant/' + discount.id"
        class="mt-3 inline-block px-4 py-2 bg-blue-500 text-center text-white text-sm rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
      >
        Reservar con descuento
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  discount: Object,
})

// Contador de Tiempo Restante
const timeLeft = ref('')

const updateTimer = () => {
  let time = props.discount.expiresIn
  const interval = setInterval(() => {
    if (time > 0) {
      const hours = Math.floor(time / 3600)
      const minutes = Math.floor((time % 3600) / 60)
      const seconds = time % 60
      timeLeft.value = `${hours}h ${minutes}m ${seconds}s`
      time--
    } else {
      timeLeft.value = 'Expirado'
      clearInterval(interval)
    }
  }, 1000)
}

onMounted(updateTimer)
</script>
