import axios from 'axios'

const API_URL = 'https://localhost:7154/api/Restaurante'

export const restaurantService = {
  async getAllRestaurants() {
    try {
      const response = await axios.get(API_URL)
      return response.data
    } catch (error) {
      console.error('Error obteniendo los restaurantes:', error)
      throw new Error('No se pudieron cargar los restaurantes')
    }
  },

  async getRestaurantById(id: number) {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      return response.data
    } catch (error) {
      console.error('Error obteniendo el restaurante:', error)
      throw new Error('No se pudo cargar el restaurante')
    }
  },

  async createRestaurant(data: any) {
    try {
      const payload = {
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        horario: data.horario,
        imagen: data.imagen,
        descripcion: data.descripcion,
        usuarioId: data.usuarioId,
      }

      console.log('📤 Enviando al backend:', JSON.stringify(payload, null, 2))

      const response = await axios.post(API_URL, payload)
      return response.data
    } catch (error) {
      console.error('❌ Error al crear restaurante:', error.response?.data || error)
      throw new Error('No se pudo crear el restaurante')
    }
  },

  async softDeleteRestaurant(id: number) {
    try {
      const response = await axios.patch(`${API_URL}/soft-delete/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al eliminar restaurante:', error)
      throw new Error('No se pudo eliminar el restaurante')
    }
  },
  async updateRestaurant(id: number, data: any) {
    try {
      // Verificamos que los valores de la imagen y el encargado se manejen correctamente
      const updatedData = {
        restauranteNombre: data.restauranteNombre, // Se asegura de que el nombre sea 'restauranteNombre' como espera el backend
        direccion: data.direccion || '',
        telefono: data.telefono || '',
        horario: data.horario || '',
        imagenUrl: data.imagenUrl || '', // Si no hay imagen, mandamos una cadena vacía
        descripcion: data.descripcion || '',
        userId: data.userId || null, // Si no se selecciona un encargado, enviamos null
      }

      console.log('📤 Enviando datos actualizados:', JSON.stringify(updatedData, null, 2))

      const response = await axios.put(`${API_URL}/${id}`, updatedData)
      return response.data
    } catch (error) {
      console.error('Error actualizando restaurante:', error.response?.data || error)
      throw new Error('No se pudo actualizar el restaurante')
    }
  },

  async updateRestaurantState(id: number) {
    try {
      const response = await axios.patch(`${API_URL}/restore/${id}`)
      return response.data
    } catch (error) {
      console.error('Error al actualizar el estado del restaurante:', error)
      throw new Error('No se pudo actualizar el estado del restaurante')
    }
  },
}
