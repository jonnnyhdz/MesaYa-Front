<template>
  <div class="h-screen w-64 bg-gray-900 text-white flex flex-col justify-between p-5 rounded-r-4xl">
    <!-- 📌 Contenedor superior con el logo y el icono -->
    <div class="space-y-20 mt-6">
      <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-3">
        <i class="fas fa-hand-sparkles"></i> MesaYa <i class="fas fa-bell"></i>
      </h2>

      <nav>
        <router-link
          v-for="item in filteredMenu"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-5 py-5 px-4 rounded-r-4xl rounded-l-md text-lg hover:bg-gray-700 transition-all"
        >
          <i :class="item.icon"></i> {{ item.label }}
        </router-link>
      </nav>
    </div>

    <!-- 📌 Botón de Logout al fondo -->
    <button
      @click="logout"
      class="mt-auto w-full py-3 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-lg font-semibold rounded-r-4xl rounded-l-md transition-all"
    >
      <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 📌 Menú condicional basado en el rol con iconos
const menuItems = {
  Admin: [
    { label: 'Inicio', path: '/dashboard-admin', icon: 'fas fa-home' },
    { label: 'Restaurantes', path: '/restaurantes-admin', icon: 'fas fa-utensils' },
    { label: 'Usuarios', path: '/gestionUsers', icon: 'fas fa-users' },
    { label: 'Reservas', path: '/reservas', icon: 'fas fa-calendar-check' },
  ],
  Usuario: [
    { label: 'Inicio', path: '/dashboard-usuario', icon: 'fas fa-home' },
    { label: 'Reservas', path: '/reservas', icon: 'fas fa-calendar-check' },
    { label: 'Favoritos', path: '/favoritos', icon: 'fas fa-heart' },
    { label: 'Historial', path: '/historial', icon: 'fas fa-history' },
  ],
  Hostess: [
    { label: 'Inicio', path: '/dashboard-hostess', icon: 'fas fa-home' },
    { label: 'Reservas', path: '/reservas', icon: 'fas fa-calendar-check' },
    { label: 'Disponibles', path: '/disponibles', icon: 'fas fa-chair' },
  ],
}

// 📌 Filtrar menú según el rol del usuario
const filteredMenu = computed(() => {
  const role = authStore.role || 'Usuario' // Default a Usuario si no hay rol
  return menuItems[role] || []
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
