import { defineStore } from 'pinia'
import { reservaService } from '@/services/reservaService'

export const useReservaStore = defineStore('reserva', {
  actions: {
    async crearReserva(data: {
      mesaId: number
      usuarioId: number
      fechaReserva: string
      numeroPersonas: number
    }) {
      try {
        const response = await reservaService.crearReserva(data)
        console.log('Reserva creada correctamente', response)
        return response
      } catch (error: any) {
        console.error('Error al crear reserva:', error)

        if (error.response) {
          console.error('Respuesta del servidor:', error.response.data)
        } else if (error.request) {
          console.error('No hubo respuesta del servidor', error.request)
        } else {
          console.error('Error al configurar la petición', error.message)
        }

        throw error
      }
    },
  },
})
