import axios from 'axios'

const API_URL = 'http://localhost:7154' // ← Aquí va directo el backend

export const reservaService = {
  async crearReserva(data: {
    mesaId: number
    usuarioId: number
    fechaReserva: string
    numeroPersonas: number
  }) {
    return await axios.post(`${API_URL}/api/Reserva`, data)
  },
}
