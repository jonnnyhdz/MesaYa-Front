import axios from 'axios'

const API_URL = 'https://localhost:7154/api'

export const userService = {
  async getAllUsers() {
    try {
      const response = await axios.get(`${API_URL}/Usuario/all`)
      return response.data?.$values || []
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error)
      return []
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

  async getUserById(id) {
    try {
      const response = await axios.get(`${API_URL}/Usuario/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener el usuario:', error)
      throw new Error('No se pudo cargar el usuario')
    }
  },

  async registerUser(userData) {
    try {
      const payload = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }
      const response = await axios.post(`${API_URL}/Usuario/register`, payload)
      return response.data
    } catch (error) {
      console.error('Error al registrar el usuario:', error)
      throw error
    }
  },

  async editUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/Usuario/edit-user`, userData)
      return response.data
    } catch (error) {
      console.error('Error editando el usuario:', error.response?.data || error)
      throw new Error('No se pudo editar el usuario')
    }
  },

  async editProfile(usuarioId, userData) {
    try {
      const response = await axios.put(`${API_URL}/Usuario/edit-profile/${usuarioId}`, userData)
      return response.data
    } catch (error) {
      console.error('Error al editar el perfil del usuario:', error.response?.data || error)
      throw new Error('No se pudo editar el perfil')
    }
  },
}
