<template>
  <div class="flex">
    <!-- Sidebar -->
    <div :class="['sidebar', isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed']">
      <!-- Botón de Hamburguesa -->
      <button @click="toggleSidebar" class="toggle-button">
        <i :class="isExpanded ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"></i>
      </button>

      <!-- Contenido del Sidebar -->
      <div class="sidebar-content flex flex-col">
        <!-- Logo (solo visible cuando está expandido) -->
        <h2 class="logo" v-show="isExpanded">
          <i class="fas fa-hand-sparkles"></i> MesaYa <i class="fas fa-bell"></i>
        </h2>

        <!-- Menú de navegación -->
        <nav class="mt-12 flex flex-col gap-4">
          <router-link
            v-for="item in filteredMenu"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ 'justify-center': !isExpanded }"
          >
            <i :class="item.icon" class="nav-icon"></i>
            <span v-show="isExpanded" class="nav-text">{{ item.label }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Botón de Logout -->
      <button @click="logout" class="logout-button" :class="{ 'justify-center': !isExpanded }">
        <i class="fas fa-sign-out-alt"></i>
        <span v-show="isExpanded" class="nav-text">Cerrar Sesión</span>
      </button>
    </div>

    <!-- Contenido principal -->
    <div class="main-content transition-all" :style="{ marginLeft: isExpanded ? '240px' : '80px' }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { showLogoutConfirm } from '@/utils/swalUtils'

const authStore = useAuthStore()
const router = useRouter()
const isExpanded = ref(true) // Estado inicial expandido

// Menú basado en el rol del usuario
const menuItems = {
  Admin: [
    { label: 'Inicio', path: '/dashboard-admin', icon: 'fas fa-home' },
    { label: 'Restaurantes', path: '/restaurantes-admin', icon: 'fas fa-utensils' },
    { label: 'Usuarios', path: '/gestionUsers', icon: 'fas fa-users' },
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

// Filtrar menú según el rol del usuario
const filteredMenu = computed(() => {
  const role = authStore.role || 'Usuario'
  return menuItems[role] || []
})

// Alternar el estado de la sidebar
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value
}

// Función para cerrar sesión con confirmación
const logout = () => {
  showLogoutConfirm(() => {
    authStore.logout()
    router.push('/login')
  })
}

// Actualizar automáticamente la Sidebar cuando el usuario cambia
watchEffect(() => {
  if (authStore.token) {
    isExpanded.value = true // Asegurar que la Sidebar aparece tras login
  }
})
</script>

<style scoped>
/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: linear-gradient(
    135deg,
    #1abc9c,
    #2980b9
  ); /* Degradado en tonos azulados y turquesa */
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
}

.sidebar-expanded {
  width: 240px;
}

.sidebar-collapsed {
  width: 80px;
}

/* Botón de Hamburguesa */
.toggle-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 10px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  align-self: flex-end;
  margin-bottom: 20px;
}

.toggle-button:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(255, 255, 255, 0.3);
}

/* Logo */
.logo {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* Menú de navegación */
.nav-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 20px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  color: white;
  text-decoration: none;
  gap: 20px;
}

.nav-item:hover {
  background-color: #588fc9b4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.nav-icon {
  font-size: 1.2rem;
}

/* Logout */
.logout-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background-color: #e53e3e;
  color: white;
  padding: 12px;
  border-radius: 20px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  margin-top: auto;
}

.logout-button:hover {
  background-color: #c53030;
  box-shadow: 0 4px 8px rgba(197, 48, 48, 0.4);
}

/* Contenido principal */
.main-content {
  transition: margin-left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 20px;
}

/* Efectos globales de transición */
.transition-all {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
