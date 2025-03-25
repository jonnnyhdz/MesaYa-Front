<template>
  <div class="fixed inset-0 flex justify-center items-center bg-opacity-30 backdrop-blur-md z-50">
    <div
      class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all scale-95 animate-fade-in-up"
    >
      <div class="flex justify-between items-center px-6 pt-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Nuevo Restaurante</h2>
        <button @click="$emit('cerrar')" class="text-gray-500 hover:text-red-600 text-xl">
          ✖
        </button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-6">
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <input
              v-model="restaurant.nombre"
              type="text"
              placeholder="Nombre"
              class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <p v-if="v$.nombre.$error" class="text-sm text-red-500 mt-1">
              {{ getErrorMessage('nombre') }}
            </p>
          </div>
          <div>
            <input
              v-model="restaurant.direccion"
              type="text"
              placeholder="Dirección"
              class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <p v-if="v$.direccion.$error" class="text-sm text-red-500 mt-1">
              {{ getErrorMessage('direccion') }}
            </p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <input
              v-model="restaurant.telefono"
              type="text"
              placeholder="Teléfono"
              class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <p v-if="v$.telefono.$error" class="text-sm text-red-500 mt-1">
              {{ getErrorMessage('telefono') }}
            </p>
          </div>
          <div>
            <input
              v-model="restaurant.horario"
              type="text"
              placeholder="Horario"
              class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <p v-if="v$.horario.$error" class="text-sm text-red-500 mt-1">
              {{ getErrorMessage('horario') }}
            </p>
          </div>
        </div>

        <div>
          <input
            v-model="restaurant.imagen"
            type="text"
            placeholder="URL de Imagen"
            class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
          />
          <p v-if="v$.imagen.$error" class="text-sm text-red-500 mt-1">
            {{ getErrorMessage('imagen') }}
          </p>
        </div>

        <div>
          <textarea
            v-model="restaurant.descripcion"
            placeholder="Descripción"
            class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 h-28 resize-none focus:ring-2 focus:ring-green-400 focus:outline-none"
          ></textarea>
          <p v-if="v$.descripcion.$error" class="text-sm text-red-500 mt-1">
            {{ getErrorMessage('descripcion') }}
          </p>
        </div>

        <div>
          <label class="text-base text-gray-600 mb-1 block">Encargado (Hostess)</label>
          <select
            v-model="restaurant.usuarioId"
            class="w-full text-lg py-3 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:outline-none"
          >
            <option disabled value="">Selecciona un Hostess</option>
            <option
              v-for="hostess in userStore.hostessUsers"
              :key="hostess.usuarioId"
              :value="hostess.usuarioId"
            >
              {{ hostess.username }}
            </option>
          </select>
          <p v-if="v$.usuarioId.$error" class="text-sm text-red-500 mt-1">
            {{ getErrorMessage('usuarioId') }}
          </p>
        </div>

        <div class="flex justify-end gap-4 pt-2">
          <button
            type="button"
            @click="$emit('cerrar')"
            class="bg-gray-500 hover:bg-gray-600 text-white text-base font-medium px-6 py-3 rounded-full"
          >
            <i class="fas fa-times mr-2"></i> Cancelar
          </button>
          <button
            type="submit"
            class="bg-teal-500 hover:bg-teal-600 text-white text-base font-medium px-6 py-3 rounded-full"
          >
            <i class="fas fa-save mr-2"></i> Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRestaurantStore } from '@/stores/restaurantStore'
import { useUserStore } from '@/stores/userStore'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, url, numeric } from '@vuelidate/validators'

const emit = defineEmits(['cerrar', 'restaurante-creado'])

const restaurantStore = useRestaurantStore()
const userStore = useUserStore()

const restaurant = ref({
  nombre: '',
  direccion: '',
  telefono: '',
  horario: '',
  imagen: 'https://source.unsplash.com/400x300/?restaurant',
  descripcion: '',
  usuarioId: '',
})

const validationMessages = {
  required: 'Este campo es obligatorio.',
  minLength: (l) => `Debe contener al menos ${l} caracteres.`,
  maxLength: (l) => `Debe contener como máximo ${l} caracteres.`,
  numeric: 'Solo se permiten números.',
  url: 'Debe ser una URL válida.',
}

const rules = computed(() => ({
  nombre: { required, minLength: minLength(3), maxLength: maxLength(50) },
  direccion: { required, minLength: minLength(5), maxLength: maxLength(100) },
  telefono: { required, numeric, minLength: minLength(10), maxLength: maxLength(15) },
  horario: { required, minLength: minLength(5), maxLength: maxLength(20) },
  imagen: { required, url },
  descripcion: { required, minLength: minLength(10), maxLength: maxLength(300) },
  usuarioId: { required },
}))

const v$ = useVuelidate(rules, restaurant)

const getErrorMessage = (field) => {
  if (!v$.value[field].$error) return ''
  const error = v$.value[field].$errors[0]
  if (error.$validator === 'required') return validationMessages.required
  if (error.$validator === 'minLength') return validationMessages.minLength(error.$params.min)
  if (error.$validator === 'maxLength') return validationMessages.maxLength(error.$params.max)
  if (error.$validator === 'numeric') return validationMessages.numeric
  if (error.$validator === 'url') return validationMessages.url
  return 'Error desconocido.'
}

onMounted(() => {
  userStore.fetchHostessUsers()
})

const submitForm = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    showErrorAlert('Por favor, completa todos los campos correctamente.')
    return
  }

  try {
    await restaurantStore.createRestaurant(restaurant.value)
    showSuccessAlert('El restaurante ha sido agregado correctamente.')
    emit('restaurante-creado')
    emit('cerrar')
  } catch (error) {
    showErrorAlert('No se pudo agregar el restaurante.')
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>
