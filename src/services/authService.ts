import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'https://localhost:7154/api'

interface DecodedToken {
  sub: string
  email: string
  jti: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
  exp: number
}

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/Auth/login`, { email, password })
      const { token } = response.data

      // Decodificamos el token
      const decoded: DecodedToken = jwtDecode(token)
      const userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      const userName = decoded.email // Aquí estás guardando el nombre

      // Guardamos en LocalStorage
      localStorage.setItem('token', token)
      localStorage.setItem('role', userRole)
      localStorage.setItem('nombre', userName) // Guardamos el nombre del usuario

      return { token, role: userRole, nombre: userName }
    } catch (error) {
      console.error('Error en login:', error)
      throw new Error('Credenciales incorrectas o error en el servidor')
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/Usuario/register`, {
        nombre: name,
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Error en registro:', error)
      throw new Error('No se pudo completar el registro')
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('nombre')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getRole() {
    return localStorage.getItem('role')
  },

  getNombre() {
    return localStorage.getItem('nombre')
  },
}
