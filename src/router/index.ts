import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RestaurantDetails from '../views/RestaurantDetails.vue'
import NotFound from '../views/NotFound.vue'
import Login from '@/views/Auth/Login.vue'
import Register from '@/views/Auth/Register.vue'
import DashboardAdmin from '@/views/Admin/DashboardAdmin.vue'
import DashboardUsuario from '@/views/User/DashboardUsuario.vue'
import DashboardHostess from '@/views/Hostess/DashboardHostess.vue'
import Restaurantes from '@/views/Admin/Restaurantes.vue'
import GestionUsuarios from '@/views/Admin/GestionUsuarios.vue'
import CreateRestaurant from '@/views/Admin/CreateRestaurant.vue'
import RestaurantDetail from '@/views/Admin/RestaurantDetail.vue'
import CreateUser from '@/views/Admin/CreateUser.vue'
import DetallesRestaurante from '@/views/Hostess/DetallesRestaurante.vue'
import EditUser from '@/views/Admin/EditUser.vue'
import EditarPerfil from '@/views/User/EditarPerfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    {
      path: '/restaurant/:id',
      name: 'restaurantDetails',
      component: RestaurantDetails,
      props: true,
    },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFound },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },

    //Rutas para el administrador
    {
      path: '/dashboard-admin',
      name: 'dashboardAdmin',
      component: DashboardAdmin,
      meta: { requiresAuth: true, role: 'Admin' },
    },
    {
      path: '/restaurantes-admin',
      name: 'restaurantes',
      component: Restaurantes,
      meta: { requiresAuth: true, role: 'Admin' },
    },
    {
      path: '/gestionUsers',
      name: 'gestiosUsers',
      component: GestionUsuarios,
      meta: { requiresAuth: true, role: 'Admin' },
    },
    {
      path: '/createRestaurant',
      name: 'createRestaurant',
      component: CreateRestaurant,
      meta: { requiresAuth: true, role: 'Admin' },
    },
    {
      path: '/createUser',
      name: 'createUser',
      component: CreateUser,
      meta: { requiresAuth: true, role: 'Admin' },
    },
    {
      path: '/admin/usuario/:userId',
      name: 'editUser',
      component: EditUser,
      meta: { requiresAuth: true, role: 'Admin' },
    },

    {
      path: '/restaurante/:id',
      name: 'restautanDetails',
      component: RestaurantDetail,
      props: true,
      meta: { requiresAuth: true, role: 'Admin' },
    },

    // Rutas para el usuario
    {
      path: '/dashboard-usuario',
      name: 'dashboardUsuario',
      component: DashboardUsuario,
      meta: { requiresAuth: true, role: 'Usuario' },
    },
    {
      path: '/editar-perfil',
      name: 'perfilUsuario',
      component: EditarPerfil,
      meta: { requiresAuth: true, role: 'Usuario' },
    },

    // Rutas para la hostess
    {
      path: '/dashboard-hostess',
      name: 'dashboardHostess',
      component: DashboardHostess,
      meta: { requiresAuth: true, role: 'Hostess' },
    },
    {
      path: '/detalles-restaurante/:id',
      name: 'detailsRestaurante',
      component: DetallesRestaurante,
      meta: { requiresAuth: true, role: 'Hostess' },
    },
  ],
})

// 🔹 Middleware de autenticación + autorización
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  // 1. Si la ruta no requiere autenticación, continuar
  if (!to.meta.requiresAuth) return next()

  // 2. Si requiere auth y no hay token, redirige a login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // 3. Si la ruta tiene un rol específico requerido
  if (to.meta.role) {
    // Si el rol del usuario no coincide, redirigir al dashboard correspondiente
    if (to.meta.role !== userRole) {
      switch (userRole) {
        case 'Admin':
          return next('/dashboard-admin')
        case 'Usuario':
          return next('/dashboard-usuario')
        case 'Hostess':
          return next('/dashboard-hostess')
        default:
          return next('/login') // Si no hay rol válido
      }
    }
  }

  // 4. Si todo está correcto, continuar
  next()
})

export default router
