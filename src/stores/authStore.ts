import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { IAuthState } from '../interfaces/AuthStateInterface'

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    token: authService.getToken(),
    role: authService.getRole(),
    nombre: authService.getNombre(),
    user: null,
  }),

  actions: {
    async login(email: string, password: string) {
      try {
        const { token, role, nombre } = await authService.login(email, password)
        this.token = token
        this.role = role
        this.nombre = nombre

        localStorage.setItem('token', token)
        localStorage.setItem('role', role)
        localStorage.setItem('nombre', nombre)
      } catch (error) {
        console.error('Error en el login:', error)
        throw error
      }
    },

    async loginWithGoogle(user: any) {
      try {
        const token = await user.getIdToken()
        this.token = token
        this.role = 'Usuario' // Asigna un rol predeterminado o ajústalo según tu lógica
        this.nombre = user.displayName || user.email
        this.user = user

        localStorage.setItem('token', token)
        localStorage.setItem('role', this.role)
        localStorage.setItem('nombre', this.nombre)
      } catch (error) {
        console.error('Error en loginWithGoogle:', error)
        throw error
      }
    },

    async logout() {
      try {
        await signOut(auth) // Cierra sesión en Firebase
        authService.logout() // Limpia datos de la API externa

        this.token = null
        this.role = null
        this.nombre = null
        this.user = null

        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('nombre')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        throw error
      }
    },

    setUser(user: any) {
      if (user) {
        this.token = user.accessToken || authService.getToken()
        this.role = user.role || authService.getRole() || 'Usuario'
        this.nombre = user.displayName || authService.getNombre() || user.email
        this.user = user
      } else {
        this.token = null
        this.role = null
        this.nombre = null
        this.user = null
      }
    },
  },
})

// Listener de autenticación para Firebase
export const initializeAuthListener = () => {
  const authStore = useAuthStore()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Si hay usuario Firebase, actualizamos el store usando Google login
      await authStore.loginWithGoogle(user)
    } else {
      // Si no hay usuario de Firebase, pero ya existe un token en localStorage (login vía API),
      // restauramos el store a partir del localStorage.
      const token = localStorage.getItem('token')
      if (token) {
        authStore.token = token
        authStore.role = localStorage.getItem('role')
        authStore.nombre = localStorage.getItem('nombre')
      } else {
        // Si no hay token, limpiamos el store
        authStore.setUser(null)
        authService.logout()
      }
    }
  })
}
