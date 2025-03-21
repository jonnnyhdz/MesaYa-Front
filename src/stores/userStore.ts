import { defineStore } from 'pinia'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    hostessUsers: [],
    allUsers: [],
  }),

  actions: {
    async fetchHostessUsers() {
      this.hostessUsers = await userService.getHostessUsers()
    },

    async fetchAllUsers() {
      this.allUsers = await userService.getAllUsers() // Almacena los usuarios en el estado
    },

    async registerUser(userData) {
      try {
        const newUser = await userService.registerUser(userData)
        this.allUsers.push(newUser) // Agrega el nuevo usuario a la lista
        return newUser
      } catch (error) {
        console.error('Error al registrar el usuario:', error)
        throw error
      }
    },
  },
})
