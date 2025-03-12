<template>
  <nav
    :class="[
      'fixed top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 shadow-lg px-10 py-4 rounded-full backdrop-blur-lg transition-all duration-300 z-[1000]',
      { 'py-3 scale-95 shadow-md bg-opacity-95': scrolled },
    ]"
    class="flex items-center justify-between w-[80%] max-w-4xl"
  >
    <h1
      class="text-2xl font-bold text-blue-600 tracking-wide transition-all duration-300 cursor-pointer"
      @click="scrollToSection('home')"
    >
      MesaYa
    </h1>

    <!-- Menú -->
    <ul class="flex space-x-8">
      <li v-for="link in links" :key="link.id">
        <a
          href="#"
          class="relative text-gray-700 hover:text-blue-500 transition-all duration-300 text-lg cursor-pointer"
          :class="{ 'font-bold text-blue-600': activeSection === link.id }"
          @click.prevent="scrollToSection(link.id)"
        >
          {{ link.name }}
          <span
            v-if="activeSection === link.id"
            class="absolute bottom-[-8px] left-0 w-full h-[3px] bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
          ></span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const links = ref([
  { id: 'home', name: 'Inicio' },
  { id: 'restaurants', name: 'Restaurantes' },
  { id: 'categories', name: 'Categoría' },
  { id: 'reviews', name: 'Reseñas' },
  { id: 'discounts', name: 'Promociones' },
  { id: 'login', name: 'Iniciar Sesión' },
])

const scrolled = ref(false)
const activeSection = ref('home')

// 📌 Detectar scroll para modificar la navbar
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
  updateActiveSection()
}

// 📌 Función para hacer scroll suave o redirigir a Login
const scrollToSection = (id) => {
  if (id === 'login') {
    router.push('/login') // 🔹 AHORA FUNCIONA CORRECTAMENTE
    return
  }

  // Si es otra sección, hace scroll normal
  const section = document.getElementById(id)
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80, // Ajustar margen superior
      behavior: 'smooth',
    })
  }
}

// 📌 Función para detectar la sección visible y cambiar la clase activa
const updateActiveSection = () => {
  let currentSection = 'home'
  links.value.forEach((link) => {
    const section = document.getElementById(link.id)
    if (section) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        currentSection = link.id
      }
    }
  })
  activeSection.value = currentSection
}

// 📌 Escuchar eventos de scroll
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
a span {
  transition: width 0.4s ease-in-out;
}
</style>
