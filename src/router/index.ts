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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/restaurant/:id',
      name: 'restaurantDetails',
      component: RestaurantDetails,
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },

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
      path: '/restaurante/:id',
      name: 'restautanDetails',
      component: RestaurantDetail,
      meta: { requiresAuth: true, role: 'Admin' },
    },

    // Rutas para el usuario
    {
      path: '/dashboard-usuario',
      name: 'dashboardUsuario',
      component: DashboardUsuario,
      meta: { requiresAuth: true, role: 'Usuario' },
    },

    // Rutas para la hostess
    {
      path: '/dashboard-hostess',
      name: 'dashboardHostess',
      component: DashboardHostess,
      meta: { requiresAuth: true, role: 'Hostess' },
    },
  ],
})

// Middleware de autenticación y autorización
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  // Si la ruta requiere autenticación y no hay token, redirige al login
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // Si la ruta tiene un rol específico y el usuario no tiene el rol correcto, redirige a Home
  if (to.meta.role && to.meta.role !== role) {
    return next('/')
  }

  next()
})

export default router
