import { defineStore } from 'pinia'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    hostessUsers: [],
    allUsers: [],
    currentPage: 1,
    itemsPerPage: 7,
  }),

  getters: {
    paginatedUsers(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage
      const end = start + state.itemsPerPage
      return state.allUsers.slice(start, end)
    },

    totalPages(state) {
      return Math.ceil(state.allUsers.length / state.itemsPerPage)
    },

    totalActivos(state) {
      return state.allUsers.filter((u) => !u.isDeleted).length
    },

    totalInactivos(state) {
      return state.allUsers.filter((u) => u.isDeleted).length
    },
  },

  actions: {
    async fetchHostessUsers() {
      this.hostessUsers = await userService.getHostessUsers()
    },

    async fetchAllUsers() {
      this.allUsers = await userService.getAllUsers()
    },

    async registerUser(userData) {
      try {
        const newUser = await userService.registerUser(userData)
        this.allUsers.push(newUser)
        return newUser
      } catch (error) {
        console.error('Error al registrar el usuario:', error)
        throw error
      }
    },

    async deleteUser(userId) {
      await userService.deleteUser(userId)
    },

    async updateUserState(userId, isDeleted) {
      await userService.updateUserState(userId, isDeleted)
    },

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
