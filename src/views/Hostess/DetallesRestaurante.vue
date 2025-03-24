<template>
  <div class="p-8">
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
        <div class="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">Mesas</h3>
          <button
            @click="abrirModalCrearMesa"
            class="bg-teal-500 text-white px-3 py-1.5 rounded-full hover:bg-teal-600 text-sm"
          >
            + Nueva Mesa
          </button>
        </div>
        <div class="p-6" v-if="mesas.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              v-for="mesa in mesas"
              :key="mesa.mesaId"
              class="relative bg-gradient-to-tr from-blue-50 to-white border border-blue-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div class="absolute -top-5 -left-5">
                <div class="bg-blue-100 border border-blue-300 rounded-full p-2 shadow-md">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3 6a1 1 0 011-1h12a1 1 0 011 1v2H3V6zM3 10h14v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4z"
                    />
                  </svg>
                </div>
              </div>
              <div class="pl-2 pt-2">
                <h4 class="text-lg font-bold text-blue-800 mb-1">Mesa #{{ mesa.mesaNumero }}</h4>
                <p class="text-sm text-gray-700">
                  Capacidad: <span class="font-semibold">{{ mesa.capacidad }}</span>
                </p>
                <p
                  class="text-sm font-medium mt-1"
                  :class="mesa.disponible ? 'text-green-600' : 'text-red-500'"
                >
                  {{ mesa.disponible ? '🟢 Disponible' : '🔴 Ocupada' }}
                </p>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  @click="abrirModalEditarMesa(mesa)"
                  class="text-blue-600 hover:text-blue-800 transition"
                  title="Editar"
                >
                  <i class="fas fa-pen"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="p-6 text-gray-500">No hay mesas registradas.</p>
      </div>

      <div
        class="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden animate-slide-up"
      >
        <div class="p-4 flex justify-between items-center border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-800">Menús</h3>
          <button
            @click="abrirModalCrearMenu"
            class="bg-teal-500 text-white px-3 py-1.5 rounded-full hover:bg-teal-600 text-sm"
          >
            + Nuevo Menú
          </button>
        </div>

        <div class="p-4" v-if="menuStore.menus.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="menu in menuStore.menus"
              :key="menu.id"
              class="rounded-lg border border-gray-200 bg-white overflow-hidden flex flex-col h-[230px] shadow-sm hover:shadow-md transition-all"
            >
              <!-- Imagen superior -->
              <div
                class="h-24 bg-cover bg-center"
                :style="{
                  backgroundImage: `url('${menu.imagen?.startsWith('data') || menu.imagen?.startsWith('http') ? menu.imagen : defaultImage}')`,
                }"
              ></div>

              <!-- Info -->
              <div class="flex flex-col justify-between flex-grow px-3 py-2 text-sm">
                <div class="space-y-0.5">
                  <h4 class="font-bold text-gray-800 truncate">{{ menu.nombreItem }}</h4>
                  <p class="text-gray-600 line-clamp-2">{{ menu.descripcion }}</p>
                  <p class="text-gray-700 font-medium">💰 ${{ menu.precio }}</p>
                  <p :class="menu.disponible ? 'text-green-600' : 'text-red-500'">
                    {{ menu.disponible ? '🟢 Disponible' : '🔴 No disponible' }}
                  </p>
                </div>

                <div class="flex justify-end space-x-2 mt-2">
                  <button
                    @click="abrirModalEditarMenu(menu)"
                    class="text-blue-500 hover:text-blue-700"
                    title="Editar"
                  >
                    <i class="fas fa-pen"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="p-4 text-gray-500">No hay menús registrados.</p>
      </div>
    </template>

    <template v-else>
      <div class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></div>
        <p class="ml-4 text-gray-700">Cargando detalles del restaurante...</p>
      </div>
    </template>

    <!-- Modales de Mesa -->
    <ModalCrearMesa
      v-if="mostrarModalCrearMesa"
      @cerrar="cerrarModalCrearMesa"
      @mesa-creada="actualizarMesas"
    />
    <ModalEditarMesa
      v-if="mostrarModalEditarMesa"
      :mesa="mesaSeleccionada"
      @cerrar="cerrarModalEditarMesa"
      @mesa-editada="actualizarMesas"
    />

    <!-- Modales de Menú -->
    <ModalCrearMenu
      v-if="mostrarModalCrearMenu"
      @cerrar="cerrarModalCrearMenu"
      @menu-creado="actualizarMenus"
    />
    <ModalEditarMenu
      v-if="mostrarModalEditarMenu"
      :menu="menuSeleccionado"
      @cerrar="cerrarModalEditarMenu"
      @menu-editado="actualizarMenus"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { hostessService } from '@/services/hostessService'
import { useMenuStore } from '@/stores/menuStore'

// Modales
import ModalCrearMesa from '@/components/ModalCrearMesa.vue'
import ModalEditarMesa from '@/components/ModalEditarMesa.vue'
import ModalCrearMenu from '@/components/ModalCrearMenu.vue'
import ModalEditarMenu from '@/components/ModalEditarMenu.vue'

// Estados locales
const route = useRoute()
const restaurante = ref(null)
const mesas = ref([])

// Store de menús
const menuStore = useMenuStore()

// Control de modales
const mostrarModalCrearMesa = ref(false)
const mostrarModalEditarMesa = ref(false)
const mostrarModalCrearMenu = ref(false)
const mostrarModalEditarMenu = ref(false)

// Elementos seleccionados para edición
const mesaSeleccionada = ref(null)
const menuSeleccionado = ref(null)

const defaultImage =
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&q=80' // puedes cambiarla a tu gusto

// Cargar datos al montar
const cargarDatos = async () => {
  const restauranteId = Number(route.params.id)
  if (restauranteId) {
    // 1) Datos del restaurante y mesas
    restaurante.value = await hostessService.getRestauranteById(restauranteId)
    mesas.value = await hostessService.getMesasByRestauranteId(restauranteId)

    // 2) Menús desde el store
    await menuStore.fetchMenusByRestaurantId(restauranteId)
  }
}

onMounted(async () => {
  await cargarDatos()
})

// Actualizar mesas tras crear/editar
const actualizarMesas = async () => {
  const restauranteId = Number(route.params.id)
  mesas.value = await hostessService.getMesasByRestauranteId(restauranteId)
}

// Actualizar menús tras crear/editar/eliminar
const actualizarMenus = async () => {
  const restauranteId = Number(route.params.id)
  await menuStore.fetchMenusByRestaurantId(restauranteId)
}

// Funciones Mesa
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

// Funciones Menú
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

const eliminarMenu = async (menuId: number) => {
  try {
    await menuStore.deleteMenuItem(menuId)
  } catch (error) {
    console.error('Error al eliminar el menú:', error)
  }
}
</script>

<style scoped>
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
