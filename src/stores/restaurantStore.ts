import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { restaurantService } from '../services/restaurantService'
import type { IRestaurant } from '@/interfaces/RestaurantInterface'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    restaurants: [] as IRestaurant[],
    currentPage: ref(1),
    itemsPerPage: 7, // Número de elementos por página
  }),

  getters: {
    // 📌 Contadores de restaurantes abiertos/cerrados
    totalAbiertos: (state) => state.restaurants.filter((r) => r.estado === 'Abierto').length,
    totalCerrados: (state) => state.restaurants.filter((r) => r.estado === 'Cerrado').length,

    // 📌 Obtener restaurantes paginados
    paginatedRestaurants: (state) => {
      const start = (state.currentPage - 1) * state.itemsPerPage
      const end = start + state.itemsPerPage
      return state.restaurants.slice(start, end)
    },

    // 📌 Calcular número total de páginas
    totalPages: (state) => Math.ceil(state.restaurants.length / state.itemsPerPage),
  },

  actions: {
    async fetchRestaurants() {
      try {
        const response = await restaurantService.getAllRestaurants()

        if (response.$values) {
          const userMap = new Map()

          response.$values.forEach((r: any) => {
            if (r.usuario && r.usuario.$id) {
              userMap.set(r.usuario.$id, r.usuario)
            }
          })

          this.restaurants = response.$values.map((r: any) => {
            let encargadoNombre = 'No asignado'

            if (r.usuario) {
              if (r.usuario.$id) {
                encargadoNombre = userMap.get(r.usuario.$id)?.username || 'No asignado'
              } else if (r.usuario.$ref) {
                encargadoNombre = userMap.get(r.usuario.$ref)?.username || 'No asignado'
              }
            }

            return {
              id: r.restauranteId,
              nombre: r.restauranteNombre,
              direccion: r.direccion,
              telefono: r.telefono,
              horario: r.horario,
              imagen: r.imagenUrl,
              descripcion: r.descripcion,
              encargado: encargadoNombre,
              estado: r.isDeleted ? 'Cerrado' : 'Abierto',
              reservas: 0,
              calificacion: 0,
            }
          })
        } else {
          console.error('⚠️ Error: No se encontró $values en la respuesta de la API')
        }
      } catch (error) {
        console.error('❌ Error cargando restaurantes:', error)
      }
    },

    async createRestaurant(data: IRestaurant) {
      const newRestaurant = await restaurantService.createRestaurant(data)
      this.restaurants.push(newRestaurant)
    },

    async deleteRestaurant(id: number) {
      await restaurantService.softDeleteRestaurant(id)
      this.restaurants = this.restaurants.filter((r) => r.id !== id)
    },

    // 📌 Funciones para cambiar página
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
  },
})
