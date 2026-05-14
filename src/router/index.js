// Configurarea Vue Router 4
// Definește toate rutele aplicației și logica de protecție (navigation guards)

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

// Importăm direct paginile cele mai vizitate (eager loading)
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

// Definim rutele aplicației
// Fiecare rută poate avea: path, name, component, meta, props
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { guestOnly: true } // doar pentru utilizatori neautentificați
  },
  {
    path: '/register',
    name: 'register',
    // Lazy loading — componenta este descărcată doar când utilizatorul navighează la /register
    // Aceasta optimizează timpul de încărcare inițial al aplicației (code splitting)
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/sitters',
    name: 'sitters',
    component: () => import('../views/Sitters.vue')
  },
  {
    path: '/sitters/:id', // parametru dinamic — :id este variabil în URL (ex: /sitters/3)
    name: 'sitter-detail',
    component: () => import('../views/SitterDetail.vue'),
    props: true // parametrii rutei sunt transmiși ca props către componentă
  },
  {
    path: '/bookings',
    name: 'bookings',
    component: () => import('../views/Bookings.vue'),
    meta: { requiresAuth: true } // necesită autentificare
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    // Rută "catch-all" pentru URL-uri inexistente — pagina 404
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue')
  }
]

// Creăm instanța router-ului folosind History API (URL-uri curate fără #)
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Comportament la schimbarea rutei — derulăm pagina sus
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation Guard global — rulează înainte de fiecare schimbare de rută
// Aici implementăm logica de protecție a rutelor (autentificare și autorizare)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Verificăm dacă ruta cere autentificare și utilizatorul NU este logat
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirectăm la login, păstrând destinația originală pentru redirect după login
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // 2. Verificăm dacă ruta cere un rol specific (ex: admin)
  if (to.meta.requiresRole && authStore.user?.role !== to.meta.requiresRole) {
    // Utilizator fără permisiuni — îl trimitem la pagina principală
    next({ name: 'home' })
    return
  }

  // 3. Dacă utilizatorul este deja autentificat și încearcă să acceseze login/register
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // Toate verificările au trecut — permitem navigarea
  next()
})

export default router
