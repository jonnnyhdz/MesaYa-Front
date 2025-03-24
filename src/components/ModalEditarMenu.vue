<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-lg animate-modal max-h-[90vh] flex flex-col"
    >
      <h3 class="text-xl font-bold text-gray-800 dark:text-white text-center mb-4">Editar Menú</h3>

      <form @submit.prevent="editarMenu" class="overflow-y-auto pr-2 space-y-4 flex-grow">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Nombre del Item</label
          >
          <input
            v-model="menuLocal.nombreItem"
            type="text"
            class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm"
            placeholder="Ej: Hamburguesa Doble"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Descripción</label
          >
          <textarea
            v-model="menuLocal.descripcion"
            class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm"
            placeholder="Descripción del platillo"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
          <input
            v-model.number="menuLocal.precio"
            type="number"
            step="0.01"
            class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm"
            placeholder="Ej: 99.99"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >¿Disponible?</label
          >
          <select
            v-model="menuLocal.disponible"
            class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm"
          >
            <option :value="true">Sí</option>
            <option :value="false">No</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Imagen (URL o archivo)</label
          >
          <input
            v-model="menuLocal.imagen"
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="mt-2 w-full text-sm text-gray-600"
          />
          <div v-if="menuLocal.imagen" class="mt-2">
            <p class="text-xs text-gray-500 mb-1">Vista previa:</p>
            <img
              :src="menuLocal.imagen"
              alt="Vista previa"
              class="rounded-lg border max-h-48 object-cover w-[50%]"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Categoría</label
          >
          <select
            v-model.number="menuLocal.categoriaId"
            class="mt-1 w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm"
          >
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
          @click="editarMenu"
          class="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useMenuStore } from '@/stores/menuStore'

const props = defineProps<{ menu: any }>()
const emit = defineEmits(['cerrar', 'menu-editado'])

const menuLocal = ref({ ...props.menu })
const menuStore = useMenuStore()

watch(
  () => props.menu,
  (newMenu) => {
    menuLocal.value = { ...newMenu }
  },
)

onMounted(async () => {
  await menuStore.fetchCategories()
})

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      menuLocal.value.imagen = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}

const editarMenu = async () => {
  try {
    if (!menuLocal.value.id) throw new Error('ID del menú no válido')

    console.log('✏️ Editando menú con datos:', menuLocal.value)

    const updatedMenu = await menuStore.updateMenuItem(menuLocal.value)
    Swal.fire({
      icon: 'success',
      title: 'Menú actualizado',
      timer: 1500,
      showConfirmButton: false,
    })
    emit('menu-editado', updatedMenu)
    emit('cerrar')
  } catch (error: any) {
    console.error('Error al editar el menú:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'No se pudo actualizar el menú.',
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
