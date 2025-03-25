<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="restaurante" class="space-y-6">
      <!-- Imagen principal -->
      <img
        :src="restaurante.imagenUrl || defaultImage"
        alt="Restaurante"
        class="w-full h-64 object-cover rounded-lg"
      />

      <!-- Detalles -->
      <div>
        <h2 class="text-3xl font-bold text-gray-800">{{ restaurante.restauranteNombre }}</h2>
        <p class="text-gray-600 mt-2">{{ restaurante.descripcion }}</p>
        <div class="text-sm text-gray-500 mt-3 space-y-1">
          <p><i class="fas fa-map-marker-alt mr-1 text-red-500"></i>{{ restaurante.direccion }}</p>
          <p><i class="fas fa-clock mr-1 text-blue-500"></i>{{ restaurante.horario }}</p>
          <span
            class="inline-block mt-2 px-2 py-1 text-xs rounded-full"
            :class="
              restaurante.estado === 'Abierto'
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            "
          >
            {{ restaurante.estado }}
          </span>
        </div>
      </div>

      <!-- Sección de Menús -->
      <div>
        <h3 class="text-2xl font-bold mb-4">Menús</h3>
        <div
          v-if="menusFiltrados.length"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div
            v-for="menu in menusFiltrados"
            :key="menu.id"
            class="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h4 class="text-lg font-semibold">{{ menu.nombreItem }}</h4>
            <p class="text-sm text-gray-600">{{ menu.descripcion }}</p>
            <p class="text-blue-600 font-bold mt-2">💰 ${{ menu.precio }}</p>
          </div>
        </div>
        <p v-else class="text-gray-500">No hay menús disponibles.</p>
      </div>

      <!-- Sección de Mesas -->
      <div>
        <h3 class="text-2xl font-bold mt-10 mb-4">Mesas Disponibles</h3>
        <div v-if="mesas.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="mesa in mesas"
            :key="mesa.mesaId"
            class="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm"
          >
            <p class="font-semibold text-gray-700">Mesa #{{ mesa.numeroMesa }}</p>
            <p class="text-sm text-gray-500">Capacidad: {{ mesa.capacidad }}</p>
            <div class="mt-3">
              <button
                v-if="mesa.disponible"
                @click="abrirModalReserva(mesa)"
                class="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
              >
                Reservar
              </button>
              <span v-else class="text-sm text-red-500">No disponible</span>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500">No hay mesas registradas.</p>
      </div>
    </div>

    <p v-else class="text-center text-gray-500">Cargando detalles del restaurante...</p>

    <!-- Modal externo -->
    <ModalReserva
      v-if="mostrarModal && mesaSeleccionada"
      :mesa="mesaSeleccionada"
      @cerrar="cerrarModal"
      @reserva-exitosa="cerrarModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ModalReserva from '../views/User/ModalReserva.vue'
import { hostessService } from '@/services/hostessService'
import type { IRestaurant, IMenu, IMesa } from '@/interfaces/RestaurantInterface'

const route = useRoute()
const restauranteId = Number(route.params.id)
const restaurante = ref<IRestaurant | null>(null)
const menus = ref<IMenu[]>([])
const mesas = ref<IMesa[]>([])
const defaultImage = 'https://source.unsplash.com/800x600/?restaurant'

const mostrarModal = ref(false)
const mesaSeleccionada = ref<IMesa | null>(null)

const abrirModalReserva = (mesa: IMesa) => {
  mesaSeleccionada.value = mesa
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  mesaSeleccionada.value = null
}

const menusFiltrados = computed(() =>
  menus.value.filter((menu) => menu.restauranteId === restauranteId),
)

onMounted(async () => {
  restaurante.value = await hostessService.getRestauranteById(restauranteId)
  menus.value = await hostessService.getMenusByRestauranteId(restauranteId)
  mesas.value = await hostessService.getMesasByRestauranteId(restauranteId)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
