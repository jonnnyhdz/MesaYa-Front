import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initializeAuthListener, useAuthStore } from '@/stores/authStore'

import App from './App.vue'
import router from './router'
import { install } from "vue3-recaptcha-v2";

const app = createApp(App)

app.use(createPinia())
app.use(router)
initializeAuthListener()

app.use(install, {
  sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY
});

// Cargar reCAPTCHA dinámicamente con la clave del .env
const recaptchaScript = document.createElement('script');
recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
recaptchaScript.async = true;
recaptchaScript.defer = true;
document.body.appendChild(recaptchaScript);


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
