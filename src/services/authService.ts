import axios from 'axios'

const API_URL = 'https://localhost:7154/api'

export const authService = {
  //Esta funcion es para el login del usuario
  async login(email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/Auth/login`, { email, password })
      const { token, user } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return { token, user }
    } catch (error) {
      console.error('Error en login:', error)
      throw new Error('Credenciales incorrectas o error en el servidor')
    }
  },

  //Esta funcion es para el registro del usuario
  async register(name: string, email: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/Usuario/register`, {
        nombre: name,
        email,
        password,
      })
      return response.data
    } catch (error) {
      console.error('Error en registro:', error)
      throw new Error('No se pudo completar el registro')
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}
