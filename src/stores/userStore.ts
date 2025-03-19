import { defineStore } from 'pinia'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    hostessUsers: [],
  }),

  actions: {
    async fetchHostessUsers() {
      this.hostessUsers = await userService.getHostessUsers()
    },
  },
})
