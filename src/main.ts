import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeAuthListener, useAuthStore } from '@/stores/authStore'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
initializeAuthListener()

// ⏱️ Listener que detecta cambios en el token y desloguea al instante
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    const authStore = useAuthStore()

    const nuevoToken = localStorage.getItem('token')
    if (!nuevoToken || nuevoToken !== authStore.token) {
      authStore.logout()
      router.push('/login')
    }
  }
})

app.mount('#app')
