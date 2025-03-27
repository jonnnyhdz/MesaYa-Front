import axios from 'axios'

const API_URL = 'https://localhost:7154/api/Reserva'

export const reservaService = {
  async crearReserva(data: {
    mesaId: number
    usuarioId: number
    fechaReserva: string
    numeroPersonas: number
  }) {
    return axios.post(`${API_URL}`, data)
  },

  async obtenerDisponibilidad(mesaId: number, fecha: string): Promise<string[]> {
    try {
      const res = await axios.get(`${API_URL}/disponibilidad`, {
        params: { mesaId, fecha }
      })

      // Asegurarse de que la respuesta tenga la propiedad $values
      if (res.data && Array.isArray(res.data.$values)) {
        return res.data.$values // Retorna los horarios disponibles como un array
      }

      return [] // Si no hay horarios disponibles
    } catch (error) {
      console.error('Error al obtener disponibilidad', error)
      return []
    }
  }
}
