<template>
  <div
    id="restaurant-list"
    class="relative w-full backdrop-blur-lg shadow-lg px-6 py-4 rounded-xl flex flex-col items-center transition-all duration-500 overflow-hidden"
    :class="{ expanded: showFilters, collapsed: !showFilters }"
  >
    <div class="w-full flex items-center justify-between space-x-4">
      <div class="relative flex-1">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar restaurantes..."
          class="w-full p-3 pl-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300"
        />
        <span class="absolute left-4 top-3 text-gray-400 text-lg"> 🔍 </span>
      </div>

      <button
        @click="toggleFilters"
        class="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        <span>Filtros</span>
      </button>
    </div>

    <transition name="expand-filters">
      <div v-if="showFilters" class="w-full mt-4 bg-gray-100 p-6 rounded-lg shadow-md">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-gray-700 font-semibold">Categoría</label>
            <select
              v-model="category"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <option value="">Todas</option>
              <option value="mexicana">Mexicana</option>
              <option value="italiana">Italiana</option>
              <option value="japonesa">Japonesa</option>
              <option value="parrilla">Parrilla</option>
              <option value="vegana">Vegana</option>
              <option value="francesa">Francesa</option>
            </select>
          </div>

          <div>
            <label class="text-gray-700 font-semibold">Rango de Precios</label>
            <select
              v-model="priceRange"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <option value="">Todos</option>
              <option value="económico">$ - Económico</option>
              <option value="moderado">$$ - Moderado</option>
              <option value="caro">$$$ - Caro</option>
            </select>
          </div>

          <div>
            <label class="text-gray-700 font-semibold">Calificación</label>
            <select
              v-model="rating"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <option value="">Todas</option>
              <option value="4">4+ estrellas</option>
              <option value="4.5">4.5+ estrellas</option>
              <option value="5">5 estrellas</option>
            </select>
          </div>

          <div>
            <label class="text-gray-700 font-semibold">Horario</label>
            <select
              v-model="schedule"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            >
              <option value="">Todos</option>
              <option value="mañana">Mañana (8AM - 12PM)</option>
              <option value="tarde">Tarde (12PM - 6PM)</option>
              <option value="noche">Noche (6PM - 12AM)</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-center">
          <button
            @click="applyFilters"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full shadow-md hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span v-if="!isLoading">Aplicar Filtros</span>
            <span v-else class="animate-spin">⏳</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const category = ref('')
const priceRange = ref('')
const rating = ref('')
const schedule = ref('')
const showFilters = ref(false)
const isLoading = ref(false)

// 🔄 Mostrar u ocultar filtros
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// 🔍 Aplicar filtros
const applyFilters = () => {
  isLoading.value = true
  setTimeout(() => {
    console.log('🔍 Buscando:', {
      search: search.value,
      category: category.value,
      priceRange: priceRange.value,
      rating: rating.value,
      schedule: schedule.value,
    })
    isLoading.value = false
    showFilters.value = false
  }, 1500)
}
</script>

<style>
.expanded {
  max-height: 500px;
  padding-bottom: 20px;
  transition:
    max-height 0.5s ease-in-out,
    padding-bottom 0.3s ease-in-out;
}

.collapsed {
  max-height: 90px;
  padding-bottom: 10px;
  transition:
    max-height 0.5s ease-in-out,
    padding-bottom 0.3s ease-in-out;
}

.expand-filters-enter-active,
.expand-filters-leave-active {
  transition:
    max-height 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
  overflow: hidden;
}

.expand-filters-enter-from,
.expand-filters-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-filters-enter-to,
.expand-filters-leave-from {
  max-height: 400px;
  opacity: 1;
}

input,
select {
  transition: box-shadow 0.3s ease;
}

input:focus,
select:focus {
  box-shadow: 0px 0px 15px rgba(0, 122, 255, 0.3);
}
</style>
