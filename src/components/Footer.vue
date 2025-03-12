<template>
  <footer class="bg-gray-800 text-white py-12 relative">
    <div class="max-w-7xl mx-auto px-6">
      <!-- 📌 Contenedor Principal -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- 🔹 Logo y Descripción -->
        <div class="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 class="text-3xl font-bold text-blue-400">MesaYa</h2>
          <p class="text-gray-300 mt-3">
            La mejor plataforma para descubrir y reservar restaurantes exclusivos con increíbles
            promociones.
          </p>
        </div>

        <!-- 🔹 Menú de Navegación -->
        <div class="text-center md:text-left">
          <h3 class="text-lg font-semibold text-blue-300">Navegación</h3>
          <ul class="mt-4 space-y-2">
            <li><router-link to="/" class="footer-link">🏠 Inicio</router-link></li>
            <li>
              <router-link to="/restaurants" class="footer-link">🍽️ Restaurantes</router-link>
            </li>
            <li><router-link to="/about" class="footer-link">📖 Sobre Nosotros</router-link></li>
            <li><router-link to="/contact" class="footer-link">📞 Contacto</router-link></li>
          </ul>
        </div>

        <!-- 🔹 Redes Sociales -->
        <div class="text-center md:text-left">
          <h3 class="text-lg font-semibold text-blue-300">Síguenos en redes</h3>
          <div class="flex justify-center md:justify-start gap-5 mt-4">
            <a href="#" class="social-icon" aria-label="Facebook"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a href="#" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-icon" aria-label="Instagram"
              ><i class="fab fa-instagram"></i
            ></a>
            <a href="#" class="social-icon" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>

      <!-- 🔹 Línea Divisoria -->
      <div class="border-t border-gray-600 my-10"></div>

      <!-- 🔹 Derechos Reservados -->
      <div class="text-center text-gray-500 text-sm">
        &copy; {{ new Date().getFullYear() }} MesaYa. Todos los derechos reservados.
      </div>
    </div>

    <!-- 🔝 Botón de "Volver Arriba" con Ícono de FontAwesome -->
    <button
      v-show="showScrollTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce"
      aria-label="Volver arriba"
    >
      <i class="fas fa-arrow-up text-xl"></i>
    </button>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 🔝 Estado para el botón de "Volver Arriba"
const showScrollTop = ref(false)

// 📌 Función para detectar el scroll y mostrar el botón
const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

// 📌 Función para volver arriba con animación suave
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 📌 Agregar y quitar el evento de scroll
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style>
/* 🔹 Estilos de enlaces en el footer */
.footer-link {
  color: #d1d5db;
  transition: color 0.3s ease-in-out;
}
.footer-link:hover {
  color: #60a5fa;
}

/* 🔹 Estilos de los iconos de redes sociales */
.social-icon {
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition:
    transform 0.3s ease,
    background 0.3s ease;
}
.social-icon i {
  font-size: 1.2rem;
}
.social-icon:hover {
  transform: scale(1.15);
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
}

/* 🔝 Animación del botón "Volver Arriba" */
.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
