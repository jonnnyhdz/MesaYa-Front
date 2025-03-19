<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white italic">
        Gestión de Restaurantes
      </h2>

      <div class="flex items-center space-x-4">
        <span class="px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-full">
          Abiertos: {{ restaurantStore.totalAbiertos }}
        </span>
        <span class="px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-full">
          Cerrados: {{ restaurantStore.totalCerrados }}
        </span>

        <router-link
          to="/createRestaurant"
          class="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition-all shadow-md"
        >
          + Agregar Restaurante
        </router-link>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr
            class="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 uppercase text-sm font-semibold"
          >
            <th class="py-3 px-4 text-left">#</th>
            <th class="py-3 px-4 text-left">Nombre</th>
            <th class="py-3 px-4 text-left">Encargado</th>
            <th class="py-3 px-4 text-center">Estado</th>
            <th class="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(restaurant, index) in restaurantStore.paginatedRestaurants"
            :key="restaurant.id"
            class="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <td class="py-4 px-4">
              {{ (restaurantStore.currentPage - 1) * restaurantStore.itemsPerPage + index + 1 }}
            </td>
            <td class="py-4 px-4 font-semibold">{{ restaurant.nombre }}</td>
            <td class="py-4 px-4 text-gray-700 dark:text-gray-300">{{ restaurant.encargado }}</td>
            <td class="py-4 px-4 text-center">
              <span
                :class="
                  restaurant.estado === 'Abierto'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                "
                class="px-3 py-1 rounded-full text-sm font-semibold"
              >
                {{ restaurant.estado }}
              </span>
            </td>
            <td class="py-4 px-4 text-center">
              <div class="flex items-center justify-center space-x-3">
                <button
                  class="bg-red-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
                  @click="deleteRestaurant(restaurant.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>

                <button
                  class="bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:bg-blue-600 transition-all"
                  @click="goToDetails(restaurant.id)"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="restaurantStore.totalPages > 1" class="flex justify-center mt-6">
      <button
        class="px-4 py-2 mx-1 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition-all"
        :disabled="restaurantStore.currentPage === 1"
        @click="restaurantStore.prevPage()"
      >
        «
      </button>

      <span class="px-4 py-2 mx-1 bg-gray-900 text-white rounded-full font-semibold">
        Página {{ restaurantStore.currentPage }} de {{ restaurantStore.totalPages }}
      </span>

      <button
        class="px-4 py-2 mx-1 bg-gray-300 text-gray-800 rounded-full shadow-md hover:bg-gray-400 transition-all"
        :disabled="restaurantStore.currentPage === restaurantStore.totalPages"
        @click="restaurantStore.nextPage()"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { useRouter } from 'vue-router'
import { showDeleteConfirm } from '@/utils/swalUtils'

const restaurantStore = useRestaurantStore()
const router = useRouter()

const goToDetails = (id) => {
  router.push(`/restaurante/${id}`)
}

onMounted(() => {
  restaurantStore.fetchRestaurants()
})

const deleteRestaurant = async (id) => {
  showDeleteConfirm(async () => {
    await restaurantStore.deleteRestaurant(id)
    restaurantStore.fetchRestaurants()

    if (restaurantStore.currentPage > restaurantStore.totalPages) {
      restaurantStore.currentPage = restaurantStore.totalPages
    }
  })
}
</script>

<style scoped>
tr:hover {
  transition: background-color 0.2s ease-in-out;
}
button {
  transition: all 0.2s ease-in-out;
}
</style>
