<script setup>
// Componenta rădăcină a aplicației PawSitter
// Conține navbar-ul modern (DaisyUI) și containerul pentru router-view

import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Computed property — reactivitate: se reactualizează automat la schimbarea stării
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

// Ascundem navbar-ul pe paginile de autentificare pentru un aspect mai curat
const showNavbar = computed(() => !['login', 'register'].includes(route.name))

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <!-- Navbar DaisyUI cu glassmorphism -->
    <header
      v-if="showNavbar"
      class="navbar bg-base-100/80 backdrop-blur-md shadow-lg sticky top-0 z-50 px-4 lg:px-8"
    >
      <div class="navbar-start">
        <!-- Meniu mobile -->
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><router-link to="/">Acasă</router-link></li>
            <li><router-link to="/sitters">Pet Sitters</router-link></li>
            <li><router-link to="/bookings" v-if="isAuthenticated">Rezervările mele</router-link></li>
            <li><router-link to="/about">Despre</router-link></li>
          </ul>
        </div>

        <!-- Logo brand -->
        <router-link to="/" class="btn btn-ghost text-2xl font-bold normal-case">
          <span class="text-3xl">🐾</span>
          <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PawSitter
          </span>
        </router-link>
      </div>

      <!-- Linkuri navigare desktop -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 gap-2 font-medium">
          <li><router-link to="/" exact-active-class="text-primary font-bold">Acasă</router-link></li>
          <li><router-link to="/sitters" active-class="text-primary font-bold">Pet Sitters</router-link></li>
          <li v-if="isAuthenticated">
            <router-link to="/bookings" active-class="text-primary font-bold">
              Rezervările mele
            </router-link>
          </li>
          <li><router-link to="/about" active-class="text-primary font-bold">Despre</router-link></li>
          <!-- Directiva v-permission afișează linkul doar pentru admini -->
          <li v-permission="'admin'">
            <router-link to="/admin" active-class="text-primary font-bold">
              Admin
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Secțiunea dreapta cu autentificare -->
      <div class="navbar-end gap-2">
        <template v-if="isAuthenticated">
          <!-- Dropdown profil utilizator -->
          <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-ghost btn-circle avatar placeholder">
              <div class="bg-primary text-primary-content rounded-full w-10">
                <span class="text-lg font-bold">{{ currentUser?.name?.charAt(0).toUpperCase() }}</span>
              </div>
            </label>
            <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56">
              <li class="menu-title">
                <span>{{ currentUser?.name }}</span>
                <span class="text-xs opacity-60">{{ currentUser?.email }}</span>
              </li>
              <li><router-link to="/profile">👤 Profil</router-link></li>
              <li><router-link to="/bookings">📅 Rezervări</router-link></li>
              <li><a @click="handleLogout" class="text-error">🚪 Deconectare</a></li>
            </ul>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="btn btn-ghost">Autentificare</router-link>
          <router-link to="/register" class="btn btn-primary">Înregistrare</router-link>
        </template>
      </div>
    </header>

    <!-- Conținut principal cu tranziții -->
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer modern cu 4 coloane informative -->
    <footer v-if="showNavbar" class="bg-neutral text-neutral-content">
      <div class="container mx-auto px-6 py-12">
        <div class="grid md:grid-cols-4 gap-8">
          <!-- Coloana brand -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-4xl">🐾</span>
              <span class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PawSitter
              </span>
            </div>
            <p class="opacity-70 mb-4 max-w-md">
              Cea mai sigură platformă de pet sitting din România. Conectăm proprietarii de animale cu sitters verificați și de încredere.
            </p>
            <div class="flex gap-3">
              <a class="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
              </a>
              <a class="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a class="btn btn-circle btn-ghost btn-sm hover:bg-primary hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/></svg>
              </a>
            </div>
          </div>

          <!-- Coloana platformă -->
          <div>
            <h3 class="font-bold text-lg mb-3 text-primary">Platformă</h3>
            <ul class="space-y-2 opacity-70">
              <li><router-link to="/sitters" class="hover:text-primary">Caută sitters</router-link></li>
              <li><router-link to="/about" class="hover:text-primary">Cum funcționează</router-link></li>
              <li><router-link to="/register" class="hover:text-primary">Devino sitter</router-link></li>
              <li><a class="hover:text-primary cursor-pointer">Tarife</a></li>
            </ul>
          </div>

          <!-- Coloana suport -->
          <div>
            <h3 class="font-bold text-lg mb-3 text-primary">Suport</h3>
            <ul class="space-y-2 opacity-70">
              <li><a class="hover:text-primary cursor-pointer">Centru de ajutor</a></li>
              <li><a class="hover:text-primary cursor-pointer">Contact</a></li>
              <li><a class="hover:text-primary cursor-pointer">Termeni</a></li>
              <li><a class="hover:text-primary cursor-pointer">Confidențialitate</a></li>
            </ul>
          </div>
        </div>

        <div class="divider opacity-30"></div>

        <div class="flex flex-col md:flex-row justify-between items-center gap-2 text-sm opacity-70">
          <p>© 2026 PawSitter. Toate drepturile rezervate.</p>
          <p class="flex items-center gap-1">
            Făcut cu <span class="text-red-500">❤️</span> pentru animale, în Cluj-Napoca
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
