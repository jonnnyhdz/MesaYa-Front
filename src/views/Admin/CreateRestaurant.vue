<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white italic">Nuevo Restaurante</h2>
    </div>

    <div
      class="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg animate-fade-in max-w-full mx-auto"
    >
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <input
              v-model="restaurant.nombre"
              type="text"
              placeholder="Nombre"
              class="input"
              required
            />
            <span v-if="v$.nombre.$error" class="text-red-500 text-sm">{{
              getErrorMessage('nombre')
            }}</span>
          </div>

          <div>
            <input
              v-model="restaurant.direccion"
              type="text"
              placeholder="Dirección"
              class="input"
              required
            />
            <span v-if="v$.direccion.$error" class="text-red-500 text-sm">{{
              getErrorMessage('direccion')
            }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <input
              v-model="restaurant.telefono"
              type="text"
              placeholder="Teléfono"
              class="input"
              required
            />
            <span v-if="v$.telefono.$error" class="text-red-500 text-sm">{{
              getErrorMessage('telefono')
            }}</span>
          </div>

          <div>
            <input
              v-model="restaurant.horario"
              type="text"
              placeholder="Horario"
              class="input"
              required
            />
            <span v-if="v$.horario.$error" class="text-red-500 text-sm">{{
              getErrorMessage('horario')
            }}</span>
          </div>
        </div>

        <div>
          <input
            v-model="restaurant.imagen"
            type="text"
            placeholder="URL de Imagen"
            class="input"
            required
          />
          <span v-if="v$.imagen.$error" class="text-red-500 text-sm">{{
            getErrorMessage('imagen')
          }}</span>
        </div>

        <div>
          <textarea
            v-model="restaurant.descripcion"
            placeholder="Descripción"
            class="input h-24 resize-none"
            required
          ></textarea>
          <span v-if="v$.descripcion.$error" class="text-red-500 text-sm">{{
            getErrorMessage('descripcion')
          }}</span>
        </div>

        <div>
          <label class="text-sm text-gray-500 dark:text-gray-300 mb-2 block"
            >Encargado (Hostess)</label
          >
          <select v-model="restaurant.usuarioId" class="input" required>
            <option value="" disabled>Selecciona un Hostess</option>
            <option
              v-for="hostess in userStore.hostessUsers"
              :key="hostess.usuarioId"
              :value="hostess.usuarioId"
            >
              {{ hostess.username }}
            </option>
          </select>
          <span v-if="v$.usuarioId.$error" class="text-red-500 text-sm">{{
            getErrorMessage('usuarioId')
          }}</span>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="submit" class="btn-primary">
            <i class="fas fa-save mr-2"></i> Guardar
          </button>
          <button @click="goBack" type="button" class="btn-secondary">
            <i class="fas fa-arrow-left mr-2"></i> Cancelar
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
import { useRouter } from 'vue-router'
import { showSuccessAlert, showErrorAlert } from '@/utils/swalUtils'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, url, numeric } from '@vuelidate/validators'

const restaurantStore = useRestaurantStore()
const userStore = useUserStore()
const router = useRouter()

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
  minLength: (length) => `Debe contener al menos ${length} caracteres.`,
  maxLength: (length) => `Debe contener como máximo ${length} caracteres.`,
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

const goBack = () => {
  router.push('/restaurantes-admin')
}

const submitForm = async () => {
  v$.value.$touch()
  if (v$.value.$invalid) {
    showErrorAlert('Por favor, completa todos los campos correctamente.')
    return
  }

  try {
    await restaurantStore.createRestaurant(restaurant.value)
    showSuccessAlert('El restaurante ha sido agregado correctamente.')
    setTimeout(() => router.push('/restaurantes-admin'), 2000)
  } catch (error) {
    showErrorAlert('No se pudo agregar el restaurante.')
  }
}
</script>
<style scoped>
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  color: #333;
  transition: all 0.3s ease-in-out;
}

.input:focus {
  border-color: #34d399;
  box-shadow: 0 0 8px rgba(52, 211, 153, 0.5);
  outline: none;
}

.btn-primary {
  background-color: #34d399;
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #2f9e79;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  padding: 10px 16px;
  border-radius: 25px;
  font-weight: bold;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #4b5563;
}
</style>
