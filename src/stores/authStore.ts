import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import type { IAuthState } from '../interfaces/AuthStateInterface'
import type { IUser } from '../interfaces/UserInterface'

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    user: authService.getUser(),
    token: authService.getToken(),
  }),

  actions: {
    async login(email: string, password: string) {
      const { token, user } = await authService.login(email, password)
      this.user = user as IUser
      this.token = token
    },

    async register(name: string, email: string, password: string) {
      const user = await authService.register(name, email, password)
      this.user = user as IUser
    },

    logout() {
      authService.logout()
      this.user = null
      this.token = null
    },
  },
})
