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
  userName?: string
}
export interface IMesa {
  mesaId: number
  mesaNumero: number
  restauranteId: number
  capacidad: number
  disponible: boolean
}

export interface IMenu {
  id: number
  nombreItem: string
  descripcion: string
  precio: number
  restauranteId: number
  categoriaId: number
  imagen: string
  disponible: boolean
  isDeleted: boolean
}
