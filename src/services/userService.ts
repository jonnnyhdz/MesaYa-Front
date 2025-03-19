import axios from 'axios'

const API_URL = 'https://localhost:7154/api'

export const userService = {
  async getHostessUsers() {
    try {
      const response = await axios.get(`${API_URL}/Usuario/hostess`)

      // ✅ Extraemos correctamente los usuarios de la clave "$values"
      return response.data?.$values || []
    } catch (error) {
      console.error('Error al obtener los usuarios Hostess:', error)
      return []
    }
  },
}
