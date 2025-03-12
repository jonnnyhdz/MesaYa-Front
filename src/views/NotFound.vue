<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-6 text-cente relative">
    <div class="relative flex justify-center">
      <img
        src="https://img.freepik.com/vector-gratis/ups-error-404-ilustracion-concepto-robot-roto_114360-5529.jpg?t=st=1741752633~exp=1741756233~hmac=79122afcf44561c32f6f8a3d54c6a10642b5181a9032549f1fb9cb02a5b94c49&w=1380"
        class="w-[30%] h-auto animate-float"
        alt="Not Found"
      />
    </div>

    <h1 class="text-4xl font-bold text-gray-900 mt-6">Página no encontrada</h1>
    <p class="text-gray-600 text-lg mt-2">
      Parece que te perdiste en el camino. No te preocupes, te llevaremos de vuelta.
    </p>

    <div
      class="w-64 h-3 rounded-full overflow-hidden mt-6 bg-gradient-to-r from-gray-300 to-gray-200"
    >
      <div
        class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-1000 ease-linear"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>
    <p class="text-gray-500 text-sm mt-2">Redirigiendo en {{ countdown }} segundos...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const countdown = ref(5)
const progress = ref(100)

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  const interval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
      progress.value = (countdown.value / 5) * 100
    } else {
      clearInterval(interval)
      goBack()
    }
  }, 1000)
})
</script>

<style>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
