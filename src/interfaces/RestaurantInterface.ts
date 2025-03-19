export interface IRestaurant {
  restauranteId?: number
  usuarioId: number
  restauranteNombre: string
  direccion: string
  telefono: string
  imagenUrl: string
  horario: string
  descripcion: string
  isDeleted: boolean
}
