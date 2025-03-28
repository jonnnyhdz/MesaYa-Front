import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { IAuthState } from '../interfaces/AuthStateInterface'

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => ({
    token: localStorage.getItem('token') || null, // Recuperar el token desde localStorage
    role: localStorage.getItem('role') || null,
    nombre: localStorage.getItem('nombre') || null,
    usuarioId: localStorage.getItem('usuarioId') ? Number(localStorage.getItem('usuarioId')) : null,
    user: null,
  }),

  actions: {
    async login(email: string, password: string, recaptchaToken:string) {
      try {
        const { token, role, nombre, usuarioId } = await authService.login(email, password, recaptchaToken)
        this.token = token
        this.role = role
        this.nombre = nombre
        this.usuarioId = usuarioId

        // Guardar en localStorage
        localStorage.setItem('token', token) // Guardar el token en localStorage
        localStorage.setItem('role', role)
        localStorage.setItem('nombre', nombre)
        if (usuarioId) localStorage.setItem('usuarioId', usuarioId.toString())
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

        // Guardar en localStorage
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

        // Limpiar el estado
        this.token = null
        this.role = null
        this.nombre = null
        this.usuarioId = null
        this.user = null

        // Limpiar localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('nombre')
        localStorage.removeItem('usuarioId')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
        throw error
      }
    },

    async register(name: string, email: string, password: string) {
      try {
        const response = await authService.register(name, email, password)
        return response
      } catch (error) {
        console.error('Error en el registro:', error)
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
        authStore.usuarioId = localStorage.getItem('usuarioId')
          ? Number(localStorage.getItem('usuarioId'))
          : null
      } else {
        // Si no hay token, limpiamos el store
        authStore.setUser(null)
        authService.logout()
      }
    }
  })
}
