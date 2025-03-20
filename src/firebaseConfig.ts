import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBVMkEqtVWh12iG8NhzzyqDajcI8GYoG1g',
  authDomain: 'mesaya-87b00.firebaseapp.com',
  projectId: 'mesaya-87b00',
  storageBucket: 'mesaya-87b00.appspot.com',
  messagingSenderId: '115511653672',
  appId: '1:115511653672:web:435435687fab24dfc74c1d',
  measurementId: 'G-Z6H5Q815KJ',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    if (user) {
      const token = await user.getIdToken()
      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        }),
      )

      return user
    }
  } catch (error) {
    console.error('Error en el login con Google:', error)
    throw error
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    user.getIdToken().then((token) => {
      localStorage.setItem('token', token)
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL,
        }),
      )
    })
  } else {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
})

export const logout = async () => {
  try {
    await signOut(auth)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

export { auth }
