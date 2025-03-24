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
      await reservaService.crearReserva(data)
    },
  },
})
