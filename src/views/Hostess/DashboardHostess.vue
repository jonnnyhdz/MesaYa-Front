<template>
  <div class="p-8">
    <!-- 🔹 Bienvenida -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="text-2xl font-bold">
        👋 Hola, <span class="text-blue-500">{{ nombre }}</span>
      </h2>
    </div>

    <!-- 🔹 Banner informativo -->
    <div class="bg-blue-50 p-6 rounded-lg mb-8 flex items-center">
      <i class="fas fa-info-circle text-blue-500 text-2xl mr-4"></i>
      <p class="text-blue-800">
        Estos son los restaurantes que gestionas. Pasa el cursor sobre ellos para ver más opciones.
      </p>
    </div>

    <!-- 🔹 Resumen de Restaurantes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="restaurante in restaurantes"
        :key="restaurante.id"
        class="relative rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 group"
      >
        <!-- 🔹 Imagen de fondo -->
        <div
          class="h-40 bg-cover bg-center"
          :style="{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${restaurante.imagenUrl})`,
          }"
        ></div>

        <!-- 🔹 Contenido de la card -->
        <div class="p-6 bg-white">
          <!-- Nombre del restaurante -->
          <h3 class="text-2xl font-bold mb-2">{{ restaurante.restauranteNombre }}</h3>

          <!-- Horario -->
          <p class="flex items-center mb-4 text-sm text-gray-600">
            <i class="fas fa-clock mr-2"></i>
            {{ restaurante.horario }}
          </p>
        </div>

        <!-- 🔹 Botón "Gestionar restaurante" (aparece al hacer hover) -->
        <div
          class="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-center py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
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

// 🔹 Computed properties
const nombre = computed(() => authStore.nombre || 'Hostess')
const restaurantes = computed(() => hostessStore.restaurantes)

// 🔹 Obtener los restaurantes vinculados al hostess al cargar la vista
onMounted(async () => {
  const userName = authStore.nombre
  if (userName) {
    await hostessStore.fetchRestaurantesByHostess(userName)
  }
})

// 🔹 Ver detalles del restaurante
const verDetalles = (restauranteId: number) => {
  router.push({ name: 'detailsRestaurante', params: { id: restauranteId } }) // Usa 'detailsRestaurante' en minúsculas
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la apariencia */
.rounded-xl {
  border-radius: 1rem; /* Bordes más redondeados */
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1; /* Mostrar el botón al hacer hover */
}
</style>
