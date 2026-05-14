<script setup>
// Pagina de înregistrare cont nou
// Demonstrează: validare complexă, indicator putere parolă, confirmare parolă

import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  role: 'user' // 'user' sau 'sitter'
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

const serverError = ref('')

// Reguli de validare grupate într-un singur obiect
// Fiecare validator returnează string-ul de eroare sau '' dacă valid
const validators = {
  name(value) {
    if (!value.trim()) return 'Numele este obligatoriu'
    if (value.length < 3) return 'Numele trebuie să aibă minim 3 caractere'
    if (value.length > 50) return 'Numele nu poate depăși 50 caractere'
    return ''
  },
  email(value) {
    if (!value) return 'Email-ul este obligatoriu'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Format email invalid'
    return ''
  },
  password(value) {
    if (!value) return 'Parola este obligatorie'
    if (value.length < 6) return 'Parola trebuie să aibă minim 6 caractere'
    // Verificăm complexitatea — cel puțin o literă și o cifră
    if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) {
      return 'Parola trebuie să conțină litere și cifre'
    }
    return ''
  },
  passwordConfirm(value) {
    if (!value) return 'Confirmarea parolei este obligatorie'
    if (value !== form.password) return 'Parolele nu coincid'
    return ''
  }
}

function validateField(field) {
  errors[field] = validators[field](form[field])
}

// Computed: calculează puterea parolei pe baza criteriilor multiple
const passwordStrength = computed(() => {
  const pwd = form.password
  if (!pwd) return null

  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 2) return { level: 'Slabă', color: 'progress-error', width: 33, text: 'text-error' }
  if (score <= 3) return { level: 'Medie', color: 'progress-warning', width: 66, text: 'text-warning' }
  return { level: 'Puternică', color: 'progress-success', width: 100, text: 'text-success' }
})

const isFormValid = computed(() => {
  return Object.keys(validators).every(field => form[field] && !errors[field])
})

async function handleSubmit() {
  // Validăm toate câmpurile înainte de submit
  Object.keys(validators).forEach(field => validateField(field))

  if (!isFormValid.value) return

  serverError.value = ''

  const result = await authStore.register({
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role
  })

  if (result.success) {
    router.push('/')
  } else {
    serverError.value = result.error
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 gradient-bg">
    <div class="card w-full max-w-md bg-base-100/95 backdrop-blur-md shadow-2xl animate-on-mount">
      <div class="card-body">
        <div class="text-center mb-6">
          <router-link to="/" class="inline-block">
            <div class="text-6xl mb-2">🐾</div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PawSitter
            </h1>
          </router-link>
          <p class="opacity-70 mt-2">Creează cont gratuit și începe astăzi!</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-3">
          <!-- Nume -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-medium">👤 Nume complet</span>
            </label>
            <input
              v-model="form.name"
              v-focus
              type="text"
              placeholder="Robert Popescu"
              class="input input-bordered"
              :class="{ 'input-error': errors.name }"
              @blur="validateField('name')"
            />
            <label v-if="errors.name" class="label py-1">
              <span class="label-text-alt text-error">{{ errors.name }}</span>
            </label>
          </div>

          <!-- Email -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-medium">📧 Email</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              placeholder="email@exemplu.ro"
              class="input input-bordered"
              :class="{ 'input-error': errors.email }"
              @blur="validateField('email')"
            />
            <label v-if="errors.email" class="label py-1">
              <span class="label-text-alt text-error">{{ errors.email }}</span>
            </label>
          </div>

          <!-- Tip cont -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-medium">🎯 Vreau să...</span>
            </label>
            <div class="grid grid-cols-2 gap-2">
              <label class="cursor-pointer">
                <input
                  v-model="form.role"
                  type="radio"
                  value="user"
                  class="peer hidden"
                />
                <div class="card bg-base-200 p-4 text-center peer-checked:bg-primary peer-checked:text-primary-content border-2 border-transparent peer-checked:border-primary transition-all">
                  <div class="text-3xl">👤</div>
                  <div class="font-semibold mt-1">Găsesc sitter</div>
                </div>
              </label>
              <label class="cursor-pointer">
                <input
                  v-model="form.role"
                  type="radio"
                  value="sitter"
                  class="peer hidden"
                />
                <div class="card bg-base-200 p-4 text-center peer-checked:bg-secondary peer-checked:text-secondary-content border-2 border-transparent peer-checked:border-secondary transition-all">
                  <div class="text-3xl">🐾</div>
                  <div class="font-semibold mt-1">Sunt sitter</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Parolă -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-medium">🔒 Parolă</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Minim 6 caractere, litere și cifre"
              class="input input-bordered"
              :class="{ 'input-error': errors.password }"
              @blur="validateField('password')"
            />
            <label v-if="errors.password" class="label py-1">
              <span class="label-text-alt text-error">{{ errors.password }}</span>
            </label>

            <!-- Indicator vizual al puterii parolei -->
            <div v-if="passwordStrength" class="mt-1">
              <progress
                class="progress w-full h-2"
                :class="passwordStrength.color"
                :value="passwordStrength.width"
                max="100"
              ></progress>
              <small :class="passwordStrength.text" class="text-xs font-semibold">
                Putere parolă: {{ passwordStrength.level }}
              </small>
            </div>
          </div>

          <!-- Confirmare parolă -->
          <div class="form-control">
            <label class="label py-1">
              <span class="label-text font-medium">🔒 Confirmă parola</span>
            </label>
            <input
              v-model="form.passwordConfirm"
              type="password"
              placeholder="Reintrodu parola"
              class="input input-bordered"
              :class="{ 'input-error': errors.passwordConfirm }"
              @blur="validateField('passwordConfirm')"
            />
            <label v-if="errors.passwordConfirm" class="label py-1">
              <span class="label-text-alt text-error">{{ errors.passwordConfirm }}</span>
            </label>
          </div>

          <!-- Eroare server -->
          <div v-if="serverError" class="alert alert-error">
            <span>{{ serverError }}</span>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="!isFormValid || authStore.loading"
          >
            <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
            {{ authStore.loading ? 'Se înregistrează...' : 'Creează cont' }}
          </button>
        </form>

        <div class="divider">SAU</div>

        <p class="text-center text-sm">
          Ai deja cont?
          <router-link to="/login" class="link link-primary font-semibold">
            Autentifică-te
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
