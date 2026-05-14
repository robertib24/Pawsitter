<script setup>
// Pagina de profil utilizator
// Permite actualizarea informațiilor personale

import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useBookingsStore } from '../stores/bookings.js'

const authStore = useAuthStore()
const bookingsStore = useBookingsStore()

// Date formular preîncărcate cu informațiile utilizatorului curent
const form = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  address: authStore.user?.address || ''
})

const saved = ref(false)
const editing = ref(false)

function saveProfile() {
  authStore.updateProfile(form)
  saved.value = true
  editing.value = false
  setTimeout(() => saved.value = false, 3000)
}

function cancelEdit() {
  form.name = authStore.user?.name || ''
  form.email = authStore.user?.email || ''
  form.phone = authStore.user?.phone || ''
  form.address = authStore.user?.address || ''
  editing.value = false
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-4xl font-bold mb-8">Profilul meu 👤</h1>

    <!-- Card profil -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <!-- Avatar mare -->
        <div class="flex items-center gap-6 mb-6">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-24">
              <span class="text-4xl font-bold">{{ authStore.user?.name?.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ authStore.user?.name }}</h2>
            <p class="opacity-70">{{ authStore.user?.email }}</p>
            <div class="badge badge-primary mt-2 capitalize">{{ authStore.user?.role }}</div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Alert succes -->
        <div v-if="saved" class="alert alert-success animate-fade-in">
          <span>✓ Profil actualizat cu succes!</span>
        </div>

        <!-- Form profil -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Nume complet</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              class="input input-bordered"
              :disabled="!editing"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              class="input input-bordered"
              :disabled="!editing"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Telefon</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="07XX XXX XXX"
              class="input input-bordered"
              :disabled="!editing"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Adresă</span>
            </label>
            <input
              v-model="form.address"
              type="text"
              placeholder="Strada, Oraș"
              class="input input-bordered"
              :disabled="!editing"
            />
          </div>
        </div>

        <!-- Butoane acțiuni -->
        <div class="card-actions justify-end mt-6">
          <template v-if="!editing">
            <button @click="editing = true" class="btn btn-primary">
              ✏️ Editează profil
            </button>
          </template>
          <template v-else>
            <button @click="cancelEdit" class="btn btn-ghost">
              Anulează
            </button>
            <button @click="saveProfile" class="btn btn-primary">
              💾 Salvează
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Statistici rezervări -->
    <div class="card bg-base-100 shadow-xl mt-6">
      <div class="card-body">
        <h3 class="card-title">📊 Activitatea mea</h3>
        <div class="stats stats-vertical sm:stats-horizontal w-full">
          <div class="stat">
            <div class="stat-title">Rezervări totale</div>
            <div class="stat-value text-primary">{{ bookingsStore.stats.total }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Active</div>
            <div class="stat-value text-info">{{ bookingsStore.stats.active }}</div>
          </div>
          <div class="stat">
            <div class="stat-title">Finalizate</div>
            <div class="stat-value text-success">{{ bookingsStore.stats.completed }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
