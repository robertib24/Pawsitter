<script setup>
// Pagina de autentificare
// Demonstrează: form validation, two-way binding (v-model), error handling

import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toast = useToast()

// Folosim reactive pentru a grupa toate câmpurile formularului într-un obiect reactiv
// Întregul obiect devine observabil — orice schimbare declanșează re-randarea componentei
const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const serverError = ref('')
const showPassword = ref(false)

// FUNCȚII DE VALIDARE
// Folosim regex pentru a verifica formatul email-ului
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email-ul este obligatoriu'
  if (!regex.test(email)) return 'Formatul email-ului este invalid'
  return ''
}

function validatePassword(password) {
  if (!password) return 'Parola este obligatorie'
  if (password.length < 6) return 'Parola trebuie să aibă minim 6 caractere'
  return ''
}

// Computed: verifică dacă tot formularul este valid
// Se actualizează automat la fiecare schimbare a câmpurilor
const isFormValid = computed(() => {
  return form.email && form.password && !errors.email && !errors.password
})

// Validare la blur (când utilizatorul iese din câmp) — UX mai prietenos
function onEmailBlur() {
  errors.email = validateEmail(form.email)
}

function onPasswordBlur() {
  errors.password = validatePassword(form.password)
}

// Trimiterea formularului
async function handleSubmit() {
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)

  if (errors.email || errors.password) return

  serverError.value = ''

  // Apelăm acțiunea de login din store
  const result = await authStore.login({
    email: form.email,
    password: form.password
  })

  if (result.success) {
    toast.success(`Bine ai revenit, ${authStore.user.name}! 🐾`)
    // Redirectăm către pagina inițială sau Home
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } else {
    serverError.value = result.error
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 gradient-bg">
    <!-- Card de autentificare cu efect de glassmorphism -->
    <div class="card w-full max-w-md bg-base-100/95 backdrop-blur-md shadow-2xl animate-on-mount">
      <div class="card-body">
        <!-- Logo + titlu -->
        <div class="text-center mb-6">
          <router-link to="/" class="inline-block">
            <div class="text-6xl mb-2">🐾</div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PawSitter
            </h1>
          </router-link>
          <p class="opacity-70 mt-2">Bine ai revenit! Conectează-te în cont.</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Email -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">📧 Email</span>
            </label>
            <input
              v-model="form.email"
              v-focus
              type="email"
              placeholder="exemplu@email.ro"
              class="input input-bordered"
              :class="{ 'input-error': errors.email }"
              @blur="onEmailBlur"
            />
            <label v-if="errors.email" class="label">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <!-- Parolă cu toggle vizibilitate -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">🔒 Parolă</span>
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Parola ta"
                class="input input-bordered w-full pr-12"
                :class="{ 'input-error': errors.password }"
                @blur="onPasswordBlur"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                v-tooltip="showPassword ? 'Ascunde parola' : 'Afișează parola'"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <label v-if="errors.password" class="label">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>
          </div>

          <!-- Eroare server -->
          <div v-if="serverError" class="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ serverError }}</span>
          </div>

          <!-- Buton submit -->
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="!isFormValid || authStore.loading"
          >
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            {{ authStore.loading ? 'Se conectează...' : 'Autentificare' }}
          </button>

          <!-- Demo hint -->
          <div class="alert bg-info/10 text-info text-sm">
            <div>
              <strong class="block mb-1">🧪 Conturi demo:</strong>
              <div class="text-xs">
                <strong>Admin:</strong> admin@pawsitter.ro / admin123<br>
                <strong>Utilizator:</strong> user@pawsitter.ro / user123
              </div>
            </div>
          </div>
        </form>

        <div class="divider">SAU</div>

        <p class="text-center text-sm">
          Nu ai cont încă?
          <router-link to="/register" class="link link-primary font-semibold">
            Înregistrează-te
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
