// src/services/menuService.ts
import axios from 'axios'
import type { IMenuItem, IMenuCategory } from '@/interfaces/MenuInterface'

const API_URL = 'https://localhost:7154/api'

export const menuService = {
  async getMenuCategories(): Promise<IMenuCategory[]> {
    try {
      const response = await axios.get(`${API_URL}/MenuCategoria`)
      return response.data?.$values || []
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      return []
    }
  },

  async getMenusByRestaurantId(restauranteId: number): Promise<IMenuItem[]> {
    try {
      const response = await axios.get(`${API_URL}/MenuItem/restaurante/${restauranteId}`)
      return response.data?.$values || []
    } catch (error) {
      console.error('Error al obtener menús del restaurante:', error)
      return []
    }
  },

  async createMenuItem(menuItem: IMenuItem): Promise<IMenuItem> {
    try {
      const response = await axios.post(`${API_URL}/MenuItem/crear`, menuItem)
      return response.data
    } catch (error) {
      console.error('Error al crear el menú:', error)
      throw error
    }
  },

  async deleteMenuItem(menuId: number): Promise<void> {
    try {
      await axios.put(`${API_URL}/MenuItem/softdelete/${menuId}`)
    } catch (error) {
      console.error('Error al eliminar el menú:', error)
      throw error
    }
  },

  async updateMenuItem(menuItem: IMenuItem): Promise<IMenuItem> {
    try {
      const response = await axios.put(`${API_URL}/MenuItem/actualizar/${menuItem.id}`, menuItem)
      return response.data
    } catch (error) {
      console.error('Error al actualizar el menú:', error)
      throw error
    }
  },
}
