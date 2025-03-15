<template>
  <div class="p-8">
    <!-- 🔹 Título, Contadores y Botón de Agregar -->
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      <button
        class="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-all"
      >
        + Agregar Usuario
      </button>
    </div>

    <!-- 🔹 Tabla de Usuarios -->
    <div class="bg-gray-900 text-white rounded-lg p-6 overflow-x-auto mt-4">
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="pb-3">#</th>
            <th class="pb-3">Nombre</th>
            <th class="pb-3">Correo</th>
            <th class="pb-3">Rol</th>
            <th class="pb-3">Estado</th>
            <th class="pb-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(usuario, index) in usuarios"
            :key="usuario.id"
            class="border-t border-gray-700"
          >
            <td class="py-3">{{ index + 1 }}</td>
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.correo }}</td>
            <td>{{ usuario.rol }}</td>
            <td>
              <span
                :class="usuario.estado === 'Activo' ? 'text-green-500' : 'text-red-500'"
                class="font-semibold"
              >
                {{ usuario.estado }}
              </span>
            </td>
            <td class="space-x-3">
              <button class="text-blue-400"><i class="fas fa-eye"></i></button>
              <button class="text-green-400"><i class="fas fa-edit"></i></button>
              <button class="text-red-400"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const usuarios = ref([
  {
    id: 1,
    nombre: 'Jonathan Hernández',
    correo: 'jonathan@gmail.com',
    rol: 'Admin',
    estado: 'Activo',
    imagen: 'https://source.unsplash.com/400x300/?man',
  },
  {
    id: 2,
    nombre: 'Daniel Tuz',
    correo: 'danieltuz@gmail.com',
    rol: 'Usuario',
    estado: 'Inactivo',
    imagen: 'https://source.unsplash.com/400x300/?woman',
  },
  {
    id: 3,
    nombre: 'Guillermo García',
    correo: 'guille@gmail.com',
    rol: 'Hostess',
    estado: 'Activo',
    imagen: 'https://source.unsplash.com/400x300/?person',
  },
  {
    id: 4,
    nombre: 'Cristian López',
    correo: 'cristian@gmail.com',
    rol: 'Usuario',
    estado: 'Inactivo',
    imagen: 'https://source.unsplash.com/400x300/?user',
  },
  {
    id: 5,
    nombre: 'Geovani Guzmán',
    correo: 'geovani@gmail.com',
    rol: 'Admin',
    estado: 'Activo',
    imagen: 'https://source.unsplash.com/400x300/?profile',
  },
])
</script>
