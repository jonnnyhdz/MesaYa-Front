<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg animate-modal max-h-[90vh] flex flex-col"
    >
      <h3 class="text-xl font-bold text-gray-800 text-center mb-4">Crear Nuevo Menú</h3>

      <form @submit.prevent="crearMenu" class="overflow-y-auto pr-2 space-y-4 flex-grow">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre del Item</label>
          <input
            v-model="menuItem.nombreItem"
            type="text"
            required
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            v-model="menuItem.descripcion"
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Precio</label>
          <input
            v-model.number="menuItem.precio"
            type="number"
            step="0.01"
            required
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">¿Disponible?</label>
          <select
            v-model="menuItem.disponible"
            required
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          >
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Imagen (URL o archivo)</label>
          <input
            v-model="menuItem.imagen"
            type="text"
            placeholder="https://example.com/imagen.jpg"
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="mt-2 w-full text-sm text-gray-600"
          />
          <div v-if="menuItem.imagen" class="mt-2">
            <p class="text-xs text-gray-500 mb-1">Vista previa:</p>
            <img
              :src="menuItem.imagen"
              alt="Vista previa"
              class="rounded-lg border max-h-48 object-cover w-[50%]"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            v-model.number="menuItem.categoriaId"
            required
            class="mt-1 w-full rounded-lg border-gray-300 shadow-sm"
          >
            <option disabled value="">Seleccione una categoría</option>
            <option
              v-for="cat in menuStore.categories"
              :key="cat.categoriaId"
              :value="cat.categoriaId"
            >
              {{ cat.nombre }}
            </option>
          </select>
        </div>
      </form>

      <div class="flex justify-end gap-4 pt-4 border-t mt-4">
        <button
          type="button"
          @click="$emit('cerrar')"
          class="px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
        <button
          @click="crearMenu"
          class="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
        >
          Crear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import { useMenuStore } from '@/stores/menuStore'

const emit = defineEmits(['cerrar', 'menu-creado'])
const route = useRoute()
const menuStore = useMenuStore()

const menuItem = ref({
  nombreItem: '',
  descripcion: '',
  precio: 0,
  disponible: true,
  restauranteId: Number(route.params.id),
  imagen: '',
  isDeleted: false,
  categoriaId: null,
})

onMounted(async () => {
  await menuStore.fetchCategories()
})

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      menuItem.value.imagen = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const crearMenu = async () => {
  try {
    if (
      menuItem.value.categoriaId === null ||
      menuItem.value.categoriaId === '' ||
      isNaN(Number(menuItem.value.categoriaId))
    ) {
      throw new Error('⚠️ La categoría es obligatoria y debe ser un número.')
    }

    const newMenu = await menuStore.createMenuItem(menuItem.value)

    Swal.fire({
      icon: 'success',
      title: 'Menú creado',
      text: 'El menú se ha creado correctamente.',
      timer: 1500,
      showConfirmButton: false,
    })

    emit('menu-creado', newMenu)
    emit('cerrar')
  } catch (error: any) {
    console.error('❌ Error al crear el menú:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo crear el menú.',
      timer: 2000,
      showConfirmButton: false,
    })
  }
}
</script>

<style scoped>
@keyframes modalAnimation {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-modal {
  animation: modalAnimation 0.4s ease-out;
}
</style>
