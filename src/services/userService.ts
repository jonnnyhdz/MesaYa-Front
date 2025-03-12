import axios from 'axios'
import { authService } from './authService'

const API_URL = 'http://localhost:5000/api/Usuario'

export const userService = {
  async register(nombre: string, email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        nombre,
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Error en el registro:', error)
      throw new Error('No se pudo registrar el usuario')
    }
  },

  async getUserById(id: number) {
    try {
      const token = authService.getToken()
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      throw new Error('No se pudo obtener la información del usuario')
    }
  },
}
