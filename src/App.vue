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

    <!-- Footer modern -->
    <footer v-if="showNavbar" class="footer footer-center p-10 bg-neutral text-neutral-content">
      <aside>
        <div class="text-5xl">🐾</div>
        <p class="font-bold text-lg">
          PawSitter <br>
          <span class="font-normal opacity-70">Animalele tale, în mâini de încredere</span>
        </p>
        <p class="opacity-70">Copyright © 2026 — Proiect demonstrativ Vue 3</p>
      </aside>
      <nav>
        <div class="grid grid-flow-col gap-4">
          <a class="hover:text-primary cursor-pointer">Facebook</a>
          <a class="hover:text-primary cursor-pointer">Instagram</a>
          <a class="hover:text-primary cursor-pointer">Contact</a>
        </div>
      </nav>
    </footer>
  </div>
</template>
