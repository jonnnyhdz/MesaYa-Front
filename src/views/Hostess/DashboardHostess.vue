<template>
  <div class="p-8 animate-fadeIn">
    <!-- Bienvenida -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        👋 Hola, <span class="text-blue-500">{{ nombre }}</span>
      </h2>
    </div>

    <!-- Banner informativo -->
    <div class="bg-blue-50 p-6 rounded-lg mb-8 flex items-center shadow-md">
      <i class="fas fa-info-circle text-blue-500 text-2xl mr-4"></i>
      <p class="text-blue-800">
        Estos son los restaurantes que gestionas. Pasa el cursor sobre ellos para ver más opciones.
      </p>
    </div>

    <!-- Cards de Restaurantes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="restaurante in restaurantes"
        :key="restaurante.id"
        class="relative rounded-xl overflow-hidden shadow-xl transform transition-transform duration-300 hover:scale-105 group"
      >
        <!-- Imagen de fondo con overlay -->
        <div
          class="h-48 bg-cover bg-center"
          :style="{
            backgroundImage: `url(${restaurante.imagenUrl})`,
          }"
        >
          <div class="w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>

        <!-- Contenido de la card -->
        <div class="p-4 bg-white dark:bg-gray-800">
          <h3 class="text-xl font-extrabold text-gray-900 dark:text-white mb-1">
            {{ restaurante.restauranteNombre }}
          </h3>
          <p class="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <i class="fas fa-clock mr-2"></i>
            {{ restaurante.horario }}
          </p>
        </div>

        <!-- Botón "Gestionar restaurante" (aparece en hover) -->
        <div
          class="absolute inset-x-0 bottom-0 bg-teal-300 text-gray-600 text-center py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          @click="verDetalles(restaurante.id)"
        >
          Gestionar restaurante
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useHostessStore } from '@/stores/hostessStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const hostessStore = useHostessStore()
const router = useRouter()

// Computed: nombre del usuario
const nombre = computed(() => authStore.nombre || 'Hostess')

// Computed: restaurantes vinculados al hostess
const restaurantes = computed(() => hostessStore.restaurantes)

// Cargar datos al montar el componente
onMounted(async () => {
  const userName = authStore.nombre
  if (userName) {
    await hostessStore.fetchRestaurantesByHostess(userName)
  }
})

// Navegar a detalles del restaurante
const verDetalles = (restauranteId: number) => {
  router.push({ name: 'detailsRestaurante', params: { id: restauranteId } })
}
</script>

<style scoped>
/* Animación de Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

/* Opcional: Personaliza el redondeado de las cards */
.rounded-xl {
  border-radius: 1rem;
}
</style>
