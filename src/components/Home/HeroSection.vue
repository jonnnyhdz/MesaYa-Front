<template>
  <div
    class="relative h-[500px] md:h-[600px] lg:h-[700px] flex flex-col items-center justify-center text-center text-white"
  >
    <div
      class="absolute inset-0 bg-cover bg-center bg-fixed opacity-70"
      style="
        background-image: url('https://blog.dazzlerhoteles.com/wp-content/uploads/2019/06/maras-1-1.jpg');
      "
    ></div>

    <div class="absolute inset-0 bg-black opacity-50"></div>

    <div class="relative z-10 px-6 md:px-12 max-w-3xl">
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold animate-fade-in">
        Descubre los mejores <span class="text-yellow-400">restaurantes</span> en Cancún
      </h1>
      <p class="mt-4 text-lg md:text-xl lg:text-2xl animate-fade-in delay-200">
        Reserva una mesa en segundos y disfruta de una experiencia única.
      </p>

      <button
        @click="scrollToRestaurants"
        class="mt-8 px-6 py-3 bg-yellow-400 text-black font-semibold text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:bg-yellow-500 animate-bounce-custom"
      >
        Explorar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const scrollToRestaurants = () => {
  const section = document.getElementById('restaurant-list')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style>
@keyframes bounce-custom {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
.animate-bounce-custom {
  animation: bounce-custom 1.5s infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1.5s ease-out;
}
</style>
