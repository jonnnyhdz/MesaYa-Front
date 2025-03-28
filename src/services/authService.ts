import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const API_URL = 'https://localhost:7154/api'

interface DecodedToken {
  sub: string
  email: string
  jti: string
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string
  exp: number
  usuarioId?: number
}

export const authService = {
  async login(email: string, password: string,  recaptchaToken:string) {
    try {
      if (!recaptchaToken) {
        throw new Error('Por favor, completa el CAPTCHA antes de iniciar sesión.');
      }
      const response = await axios.post(`${API_URL}/Auth/login`, { email, password, recaptchaToken })
      const { token } = response.data

      // Decodificamos el token
      const decoded: DecodedToken = jwtDecode(token)
      const userRole = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      const userName = decoded.email
      const usuarioId = decoded.usuarioId || null

      // Guardamos en LocalStorage
      localStorage.setItem('token', token)
      localStorage.setItem('role', userRole)
      localStorage.setItem('nombre', userName)
      if (usuarioId) localStorage.setItem('usuarioId', usuarioId.toString())

      return { token, role: userRole, nombre: userName, usuarioId }
    } catch (error: unknown) {
      
      if (error instanceof Error) {
        // Si es un Error, tratamos el mensaje de error
        if (error.message === 'Por favor, completa el CAPTCHA antes de iniciar sesión.') {
          throw new Error('Por favor, completa el CAPTCHA antes de iniciar sesión.');
        } else {
          throw new Error('Credenciales incorrectas o error en el servidor');
        }
      } else {
        // Si el error no es una instancia de Error, lanzamos un error genérico
        throw new Error('Se produjo un error desconocido');
      }
    }
  },

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

  logout: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      await axios.post(
        `${API_URL}/Auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Limpia localStorage después de cerrar sesión exitosamente
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('nombre')
      localStorage.removeItem('usuarioId')
    } catch (error) {
      console.error('Error en logout:', error)
      throw new Error('No se pudo cerrar sesión correctamente')
    }
  },

  getToken() {
    return localStorage.getItem('token')
  },

  getRole() {
    return localStorage.getItem('role')
  },

  getNombre() {
    return localStorage.getItem('nombre')
  },
}
