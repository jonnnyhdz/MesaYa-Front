import Swal from 'sweetalert2'

/**
 * 🔥 Muestra una alerta de éxito
 * @param {string} message - Mensaje de éxito
 */
export const showSuccessAlert = (message: string) => {
  Swal.fire({
    title: '¡Éxito!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#10b981',
    timer: 2500,
    timerProgressBar: true,
  })
}

/**
 * ⚠️ Muestra una alerta de advertencia cuando se habilita la edición
 */
export const showEditModeAlert = () => {
  Swal.fire({
    icon: 'info',
    title: 'Modo Edición Activado',
    text: 'Ahora puedes modificar la información del restaurante.',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  })
}

/**
 * 🗑️ Muestra una alerta de confirmación para eliminar un restaurante
 * @param {Function} onConfirm - Función a ejecutar si se confirma la eliminación
 */
export const showDeleteConfirm = (onConfirm: () => void) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el restaurante de la lista.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm()
      Swal.fire({
        title: '¡Eliminado!',
        text: 'El restaurante ha sido eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#10b981',
      })
    }
  })
}

/**
 * 🔄 Muestra una alerta de carga mientras se ejecuta una acción
 * @param {string} message - Mensaje de carga
 */
export const showLoadingAlert = (message: string) => {
  Swal.fire({
    title: '⏳ Procesando...',
    text: message,
    allowOutsideClick: false,
    showConfirmButton: false,
    willOpen: () => {
      Swal.showLoading()
    },
  })
}

/**
 * ❌ Muestra una alerta de error
 * @param {string} message - Mensaje de error
 */
export const showErrorAlert = (message: string) => {
  Swal.fire({
    title: '❌ Error',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ef4444',
  })
}

export const showLogoutConfirm = (onConfirm) => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Se cerrará la sesión y tendrás que volver a loguearte',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm()
      Swal.fire({
        title: '¡Sesión cerrada!',
        text: 'Has cerrado sesión correctamente.',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  })
}
