<template>
  <div class="p-8">
    <!-- Bloque condicional: muestra datos si restaurante existe, o estado de carga -->
    <template v-if="restaurante">
      <!-- 🔹 Título -->
      <h2 class="text-xl italic font-bold mb-8 text-blue-600 animate-fade-in">
        Detalles del Restaurante
      </h2>

      <!-- Card: Detalles Principales -->
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-slide-up mb-8"
      >
        <div class="grid grid-cols-1 md:grid-cols-2">
          <!-- Imagen del restaurante -->
          <div class="h-64 md:h-auto">
            <img
              :src="restaurante.imagenUrl"
              alt="Imagen del restaurante"
              class="w-full h-full object-cover"
            />
          </div>
          <!-- Información del restaurante -->
          <div class="p-6 space-y-6">
            <h3 class="text-3xl font-bold text-gray-800">
              {{ restaurante.restauranteNombre }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-center">
                <i class="fas fa-clock text-blue-500 mr-2"></i>
                <p class="text-lg text-gray-700">
                  <strong>Horario:</strong> {{ restaurante.horario }}
                </p>
              </div>
              <div class="flex items-center">
                <i class="fas fa-phone-alt text-blue-500 mr-2"></i>
                <p class="text-lg text-gray-700">
                  <strong>Teléfono:</strong> {{ restaurante.telefono }}
                </p>
              </div>
            </div>
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt text-blue-500 mr-2"></i>
              <p class="text-lg text-gray-700">
                <strong>Dirección:</strong> {{ restaurante.direccion }}
              </p>
            </div>
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mr-2 mt-1"></i>
              <p class="text-lg text-gray-700">
                <strong>Descripción:</strong> {{ restaurante.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Card: Mesas -->
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-slide-up mb-8"
      >
        <div class="p-6 flex justify-between items-center border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-800">Mesas</h3>
          <button
            @click="abrirModalCrearMesa"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Crear Mesa
          </button>
        </div>
        <div class="p-6" v-if="mesas.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="mesa in mesas"
              :key="mesa.mesaId"
              class="bg-gray-50 p-4 rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
            >
              <p class="text-lg font-semibold">Mesa #{{ mesa.mesaNumero }}</p>
              <p class="text-sm text-gray-600">Capacidad: {{ mesa.capacidad }}</p>
              <p class="text-sm text-gray-600">
                {{ mesa.disponible ? 'Disponible' : 'No disponible' }}
              </p>
              <div class="flex space-x-2 mt-2">
                <button
                  @click="abrirModalEditarMesa(mesa)"
                  class="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="eliminarMesa(mesa.mesaId)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="p-6 text-gray-500">No hay mesas registradas.</p>
      </div>

      <!-- Card: Menús -->
      <div
        class="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden animate-slide-up"
      >
        <div class="p-6 flex justify-between items-center border-b border-gray-200">
          <h3 class="text-2xl font-bold text-gray-800">Menús</h3>
          <button
            @click="abrirModalCrearMenu"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Crear Menú
          </button>
        </div>
        <div class="p-6" v-if="menus.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="menu in menus"
              :key="menu.id"
              class="bg-gray-50 p-4 rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
            >
              <p class="text-lg font-semibold">{{ menu.nombreItem }}</p>
              <p class="text-sm text-gray-600">{{ menu.descripcion }}</p>
              <p class="text-sm text-gray-600">Precio: ${{ menu.precio }}</p>
              <p class="text-sm text-gray-600">
                {{ menu.disponible ? 'Disponible' : 'No disponible' }}
              </p>
              <div class="flex space-x-2 mt-2">
                <button
                  @click="abrirModalEditarMenu(menu)"
                  class="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="eliminarMenu(menu.id)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="p-6 text-gray-500">No hay menús registrados.</p>
      </div>
    </template>
    <template v-else>
      <!-- Estado de carga -->
      <div class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
        <p class="ml-4 text-gray-700">Cargando detalles del restaurante...</p>
      </div>
    </template>

    <!-- Modales para Mesas y Menús -->
    <ModalCrearMesa
      v-if="mostrarModalCrearMesa"
      @cerrar="cerrarModalCrearMesa"
      @mesa-creada="actualizarMesas"
    />
    <ModalEditarMesa
      v-if="mostrarModalEditarMesa"
      :mesa="mesaSeleccionada"
      @cerrar="cerrarModalEditarMesa"
    />
    <ModalCrearMenu v-if="mostrarModalCrearMenu" @cerrar="cerrarModalCrearMenu" />
    <ModalEditarMenu
      v-if="mostrarModalEditarMenu"
      :menu="menuSeleccionado"
      @cerrar="cerrarModalEditarMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { hostessService } from '@/services/hostessService'
import ModalCrearMesa from '@/components/ModalCrearMesa.vue'

const route = useRoute()
const restaurante = ref(null)
const mesas = ref([])
const menus = ref([])

const mostrarModalCrearMesa = ref(false)
const mostrarModalEditarMesa = ref(false)
const mostrarModalCrearMenu = ref(false)
const mostrarModalEditarMenu = ref(false)
const mesaSeleccionada = ref(null)
const menuSeleccionado = ref(null)

// Función para cargar datos al montar la vista
const cargarDatos = async () => {
  const restauranteId = Number(route.params.id)
  if (restauranteId) {
    restaurante.value = await hostessService.getRestauranteById(restauranteId)
    mesas.value = await hostessService.getMesasByRestauranteId(restauranteId)
    menus.value = await hostessService.getMenusByRestauranteId(restauranteId)
  }
}

onMounted(async () => {
  await cargarDatos()
})

// Función para actualizar las mesas tras crear una nueva
const actualizarMesas = async () => {
  const restauranteId = Number(route.params.id)
  mesas.value = await hostessService.getMesasByRestauranteId(restauranteId)
}

// Funciones para Mesas
const abrirModalCrearMesa = () => {
  mostrarModalCrearMesa.value = true
}
const abrirModalEditarMesa = (mesa) => {
  mesaSeleccionada.value = mesa
  mostrarModalEditarMesa.value = true
}
const cerrarModalCrearMesa = () => {
  mostrarModalCrearMesa.value = false
}
const cerrarModalEditarMesa = () => {
  mostrarModalEditarMesa.value = false
}
const eliminarMesa = async (mesaId) => {
  try {
    await hostessService.eliminarMesa(mesaId)
    mesas.value = mesas.value.filter((mesa) => mesa.mesaId !== mesaId)
  } catch (error) {
    console.error('Error al eliminar la mesa:', error)
  }
}

// Funciones para Menús
const abrirModalCrearMenu = () => {
  mostrarModalCrearMenu.value = true
}
const abrirModalEditarMenu = (menu) => {
  menuSeleccionado.value = menu
  mostrarModalEditarMenu.value = true
}
const cerrarModalCrearMenu = () => {
  mostrarModalCrearMenu.value = false
}
const cerrarModalEditarMenu = () => {
  mostrarModalEditarMenu.value = false
}
const eliminarMenu = async (menuId) => {
  try {
    await hostessService.eliminarMenu(menuId)
    menus.value = menus.value.filter((menu) => menu.id !== menuId)
  } catch (error) {
    console.error('Error al eliminar el menú:', error)
  }
}
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
.animate-slide-up {
  animation: slide-up 0.8s ease-out;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
