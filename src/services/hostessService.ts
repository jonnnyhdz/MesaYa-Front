import axios from 'axios'
import type { IRestaurant, IMesa, IMenu } from '@/interfaces/RestaurantInterface'

const API_URL = 'https://localhost:7154/api'

export const hostessService = {
  async getRestaurantesByHostess(userName: string): Promise<IRestaurant[]> {
    try {
      const response = await axios.get(`${API_URL}/Restaurante`)
      const restaurantes: IRestaurant[] = response.data?.$values || []
      return restaurantes.filter((r) => r.userName === userName)
    } catch (error) {
      console.error('Error al obtener los restaurantes del hostess:', error)
      return []
    }
  },

  async getRestauranteById(restauranteId: number): Promise<IRestaurant> {
    try {
      const response = await axios.get(`${API_URL}/Restaurante/${restauranteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener los detalles del restaurante:', error)
      throw error
    }
  },

  async getMesasByRestauranteId(restauranteId: number): Promise<IMesa[]> {
    try {
      const response = await axios.get(`${API_URL}/Mesa`)
      const mesas: IMesa[] = response.data?.$values || []
      return mesas.filter((mesa) => mesa.restauranteId === restauranteId)
    } catch (error) {
      console.error('Error al obtener las mesas del restaurante:', error)
      return []
    }
  },

  async getMenusByRestauranteId(restauranteId: number): Promise<IMenu[]> {
    try {
      const response = await axios.get(`${API_URL}/MenuItem`)
      const menus: IMenu[] = response.data?.$values || []
      return menus.filter((menu) => menu.restauranteId === restauranteId)
    } catch (error) {
      console.error('Error al obtener los menús del restaurante:', error)
      return []
    }
  },

  async crearMesa(mesa: IMesa): Promise<void> {
    try {
      const response = await axios.post(`${API_URL}/Mesa/crear`, mesa)
      console.log('Respuesta del backend:', response.data) // Verifica la respuesta del backend
      return response.data
    } catch (error) {
      console.error('Error al crear la mesa:', error)
      throw error
    }
  },
}
