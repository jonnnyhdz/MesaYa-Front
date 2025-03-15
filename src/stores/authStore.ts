import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import type { IAuthState } from '../interfaces/AuthStateInterface'
import type { IUser } from '../interfaces/UserInterface'

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    token: authService.getToken(),
    role: authService.getRole(),
    nombre: authService.getNombre(),
  }),

  actions: {
    async login(email: string, password: string) {
      const { token, role, nombre } = await authService.login(email, password)
      this.token = token
      this.role = role
      this.nombre = nombre
    },

    async register(name: string, email: string, password: string) {
      const user = await authService.register(name, email, password)
      this.user = user as IUser
    },

    logout() {
      authService.logout()
      this.token = null
      this.role = null
      this.nombre = null
    },
  },
})
