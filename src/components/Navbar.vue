<template>
  <div>
    <!-- NAVBAR -->
    <nav
      :class="[
        'fixed top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 shadow-lg px-10 py-4 rounded-full backdrop-blur-lg transition-all duration-300 z-[1000]',
        { 'py-3 scale-95 shadow-md bg-opacity-95': scrolled },
      ]"
      class="flex items-center justify-between w-[80%] max-w-4xl"
    >
      <!-- Logo -->
      <h1
        class="text-2xl font-bold text-blue-600 tracking-wide cursor-pointer"
        @click="handleHomeClick"
      >
        MesaYa
      </h1>

      <!-- Navegación -->
      <ul class="flex space-x-8 items-center">
        <li v-for="link in computedLinks" :key="link.id">
          <a
            href="#"
            class="relative text-gray-700 hover:text-blue-500 transition text-lg cursor-pointer"
            :class="{ 'font-bold text-blue-600': activeSection === link.id }"
            @click.prevent="handleLinkClick(link)"
          >
            {{ link.name }}
            <span
              v-if="activeSection === link.id"
              class="absolute bottom-[-8px] left-0 w-full h-[3px] bg-blue-500 rounded-full"
            ></span>
          </a>
        </li>

        <!-- Botón de sesión -->
        <li>
          <button
            v-if="authStore.token"
            @click="logout"
            class="text-red-500 font-medium hover:text-red-600 transition text-lg flex items-center"
          >
            <i class="fas fa-sign-out-alt mr-1"></i>Salir
          </button>
          <button
            v-else
            @click="router.push('/login')"
            class="text-blue-500 font-medium hover:text-blue-600 transition text-lg"
          >
            Iniciar Sesión
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modal para editar perfil -->
    <ModalEditarPerfil v-if="mostrarModalPerfil" @cerrar="mostrarModalPerfil = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { showLogoutConfirm } from '@/utils/swalUtils'
import ModalEditarPerfil from '../views/User/EditarPerfil.vue' // Asegúrate de la ruta correcta

const router = useRouter()
const authStore = useAuthStore()

const scrolled = ref(false)
const activeSection = ref('home')
const mostrarModalPerfil = ref(false)

// 🔹 Links públicos (sin login)
const publicLinks = [
  { id: 'home', name: 'Inicio' },
  { id: 'restaurants', name: 'Restaurantes' },
  { id: 'categories', name: 'Categoría' },
  { id: 'reviews', name: 'Reseñas' },
  { id: 'discounts', name: 'Promociones' },
]

// 🔹 Links privados (con login de usuario)
const privateLinks = [
  { id: 'dashboard', name: 'Inicio', route: '/dashboard-usuario' },
  { id: 'favoritos', name: 'Favoritos', route: '/favoritos' },
  { id: 'reservas', name: 'Reservas', route: '/reservas' },
  { id: 'perfil', name: 'Perfil', action: 'abrir-modal-perfil' }, // <-- Aquí se abre modal
]

const computedLinks = computed(() => {
  return authStore.token ? privateLinks : publicLinks
})

const handleHomeClick = () => {
  if (authStore.token) {
    router.push('/dashboard-usuario')
  } else {
    scrollToSection('home')
  }
}

const handleLinkClick = (link) => {
  if (link.route) {
    router.push(link.route)
  } else if (link.action === 'abrir-modal-perfil') {
    mostrarModalPerfil.value = true
  } else {
    scrollToSection(link.id)
  }
}

const scrollToSection = (id) => {
  const section = document.getElementById(id)
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80,
      behavior: 'smooth',
    })
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
  updateActiveSection()
}

const updateActiveSection = () => {
  let currentSection = 'home'
  computedLinks.value.forEach((link) => {
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

// 🔹 Cerrar sesión
const logout = () => {
  showLogoutConfirm(() => {
    authStore.logout()
    router.push('/login')
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  updateActiveSection()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
a span {
  transition: width 0.4s ease-in-out;
}
</style>
