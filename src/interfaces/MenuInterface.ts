export interface IMenuCategory {
  id: number
  nombre: string
}

export interface IMenuItem {
  itemId?: number
  nombreItem: string
  descripcion?: string
  precio: number
  restauranteId: number
  categoriaId: number
  imagen: string
  disponible: boolean
  isDeleted?: boolean
}
