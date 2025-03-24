// src/stores/menuStore.ts
import { defineStore } from 'pinia'
import { menuService } from '@/services/menuService'
import type { IMenuItem, IMenuCategory } from '@/interfaces/MenuInterface'

export const useMenuStore = defineStore('menuStore', {
  state: () => ({
    menus: [] as IMenuItem[],
    categories: [] as IMenuCategory[],
  }),

  actions: {
    async fetchCategories() {
      this.categories = await menuService.getMenuCategories()
    },

    async fetchMenusByRestaurantId(restauranteId: number) {
      this.menus = await menuService.getMenusByRestaurantId(restauranteId)
    },

    async createMenuItem(menuItem: IMenuItem) {
      const newMenu = await menuService.createMenuItem(menuItem)
      this.menus.push(newMenu)
      return newMenu
    },

    async deleteMenuItem(menuId: number) {
      await menuService.deleteMenuItem(menuId)
      this.menus = this.menus.filter((m) => m.id !== menuId)
    },

    async updateMenuItem(menuItem: IMenuItem) {
      const updated = await menuService.updateMenuItem(menuItem)
      const index = this.menus.findIndex((m) => m.id === menuItem.id)
      if (index !== -1) {
        this.menus[index] = updated
      }
      return updated
    },
  },
})
