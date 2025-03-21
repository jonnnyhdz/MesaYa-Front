import { defineStore } from 'pinia'
import { hostessService } from '@/services/hostessService'
import type { IRestaurant } from '@/interfaces/RestaurantInterface'

interface HostessState {
  restaurantes: IRestaurant[]
}

export const useHostessStore = defineStore('hostess', {
  state: (): HostessState => ({
    restaurantes: [],
  }),

  actions: {
    async fetchRestaurantesByHostess(userName: string) {
      this.restaurantes = await hostessService.getRestaurantesByHostess(userName)
    },
  },
})
