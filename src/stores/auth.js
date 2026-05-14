// Store Pinia pentru gestionarea autentificării și sesiunii utilizatorului
// Pinia este soluția oficială recomandată pentru state management în Vue 3

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

// Definim store-ul cu sintaxa Composition API (Setup Stores)
// Aceasta este sintaxa modernă, mai flexibilă decât Options API
export const useAuthStore = defineStore('auth', () => {
  // STATE — variabile reactive care reprezintă starea store-ului
  // Încercăm să restaurăm sesiunea din localStorage la încărcarea aplicației
  // Astfel, utilizatorul rămâne logat și după refresh
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // GETTERS — proprietăți calculate derivate din state
  // Vue recalculează automat acestea când dependențele se schimbă
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSitter = computed(() => user.value?.role === 'sitter')

  // ACTIONS — funcții care modifică starea
  // Acțiunea de login — comunică cu serverul pentru verificarea credențialelor
  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      // Apel HTTP către serverul Express (proxy-uit prin Vite la /api)
      const response = await axios.post('/api/auth/login', credentials)

      // Salvăm datele primite în state și în localStorage pentru persistență
      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      // Configurăm header-ul Authorization pentru toate cererile axios viitoare
      // Acesta va include automat token-ul JWT
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Eroare la autentificare'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Acțiunea de înregistrare — creează un cont nou
  async function register(userData) {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post('/api/auth/register', userData)

      token.value = response.data.token
      user.value = response.data.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Eroare la înregistrare'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Acțiunea de deconectare — șterge sesiunea
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  // Actualizare profil utilizator
  async function updateProfile(updates) {
    try {
      const response = await axios.put('/api/auth/profile', updates)
      user.value = { ...user.value, ...response.data.user }
      localStorage.setItem('user', JSON.stringify(user.value))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.message }
    }
  }

  // La pornirea aplicației, dacă avem token salvat, îl configurăm pentru axios
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  // Returnăm tot ce trebuie expus din store
  return {
    user, token, loading, error,
    isAuthenticated, isAdmin, isSitter,
    login, register, logout, updateProfile
  }
})
