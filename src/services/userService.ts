import axios from 'axios'

const API_URL = 'https://localhost:7154/api'

export const userService = {
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/Usuario/all`)
      return response.data?.$values || [] // Asegúrate de extraer los usuarios de $values
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error)
      return []
    }
  },

  async registerUser(userData) {
    try {
      const payload = {
        username: userData.username, // Nombre de usuario
        email: userData.email, // Correo electrónico
        password: userData.password, // Contraseña
      }
      const response = await axios.post(`${API_URL}/Usuario/register`, payload)
      return response.data
    } catch (error) {
      console.error('Error al registrar el usuario:', error)
      throw error
    }
  },

  async getHostessUsers() {
    try {
      const response = await axios.get(`${API_URL}/Usuario/hostess`)
      return response.data?.$values || []
    } catch (error) {
      console.error('Error al obtener los usuarios Hostess:', error)
      return []
    }
  },
}
