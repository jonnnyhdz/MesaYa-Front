<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-[400px]">
      <h2 class="text-2xl font-bold text-gray-900">✍️ Agregar Reseña</h2>
      <input
        v-model="newReview.user"
        type="text"
        placeholder="Tu nombre"
        class="w-full p-2 border rounded-md mt-4"
      />
      <input
        v-model="newReview.image"
        type="url"
        placeholder="URL de tu foto (opcional)"
        class="w-full p-2 border rounded-md mt-2"
      />
      <select v-model="newReview.rating" class="w-full p-2 border rounded-md mt-2">
        <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
      </select>
      <textarea
        v-model="newReview.comment"
        placeholder="Escribe tu reseña..."
        class="w-full p-2 border rounded-md mt-2"
      ></textarea>
      <div class="flex justify-end space-x-3 mt-4">
        <button @click="$emit('close')" class="text-gray-500">Cancelar</button>
        <button @click="submitReview" class="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Publicar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const newReview = ref({ user: '', image: '', rating: 5, comment: '' })

const submitReview = () => {
  if (!newReview.value.user || !newReview.value.comment) return
  newReview.value.image = newReview.value.image || 'https://randomuser.me/api/portraits/lego/1.jpg'
  emit('submit', newReview.value)
}
</script>
