<script setup>
// Pagina listă pet sitters cu filtre și sortare
// Demonstrează: v-model, computed properties, reactivitate cu filtre multiple

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useSittersStore } from '../stores/sitters.js'
import SitterCard from '../components/SitterCard.vue'
import BookingModal from '../components/BookingModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const sittersStore = useSittersStore()

// State pentru modal
const selectedSitter = ref(null)
const showBookingModal = ref(false)

// Vedem dacă filtrele sunt active (pentru a afișa butonul de resetare)
const hasActiveFilters = computed(() => {
  return sittersStore.searchQuery ||
         sittersStore.selectedService ||
         sittersStore.selectedLocation ||
         sittersStore.maxPrice < 200 ||
         sittersStore.minRating > 0
})

function handleBook(sitter) {
  // Verificăm dacă utilizatorul este autentificat
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: '/sitters' } })
    return
  }
  selectedSitter.value = sitter
  showBookingModal.value = true
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header pagină -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-2">Găsește pet sitter-ul perfect 🐾</h1>
      <p class="opacity-70 text-lg">
        {{ sittersStore.filteredSitters.length }} {{ sittersStore.filteredSitters.length === 1 ? 'sitter disponibil' : 'sitters disponibili' }}
      </p>
    </div>

    <div class="grid lg:grid-cols-4 gap-6">
      <!-- SIDEBAR cu filtre -->
      <aside class="lg:col-span-1">
        <div class="card bg-base-100 shadow-lg sticky top-24">
          <div class="card-body">
            <div class="flex justify-between items-center mb-2">
              <h2 class="card-title text-lg">🔍 Filtre</h2>
              <button
                v-if="hasActiveFilters"
                @click="sittersStore.resetFilters"
                class="btn btn-ghost btn-xs"
              >
                Resetează
              </button>
            </div>

            <!-- Căutare text -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs font-semibold">CĂUTARE</span>
              </label>
              <input
                v-model="sittersStore.searchQuery"
                type="text"
                placeholder="Caută după nume sau descriere..."
                class="input input-bordered input-sm"
              />
            </div>

            <!-- Tip animal -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs font-semibold">TIP ANIMAL</span>
              </label>
              <select v-model="sittersStore.selectedService" class="select select-bordered select-sm">
                <option value="">Toate animalele</option>
                <option v-for="service in sittersStore.services" :key="service" :value="service">
                  {{ service.charAt(0).toUpperCase() + service.slice(1) }}
                </option>
              </select>
            </div>

            <!-- Locație -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs font-semibold">LOCAȚIE</span>
              </label>
              <select v-model="sittersStore.selectedLocation" class="select select-bordered select-sm">
                <option value="">Toate locațiile</option>
                <option v-for="loc in sittersStore.locations" :key="loc" :value="loc">
                  📍 {{ loc }}
                </option>
              </select>
            </div>

            <!-- Preț maxim cu slider -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs font-semibold">PREȚ MAXIM/ZI</span>
                <span class="label-text-alt font-bold text-primary">{{ sittersStore.maxPrice }} RON</span>
              </label>
              <input
                v-model.number="sittersStore.maxPrice"
                type="range"
                min="50"
                max="200"
                step="10"
                class="range range-primary range-sm"
              />
              <div class="flex justify-between text-xs opacity-60 mt-1">
                <span>50</span>
                <span>200</span>
              </div>
            </div>

            <!-- Rating minim -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs font-semibold">RATING MINIM</span>
              </label>
              <div class="rating rating-md">
                <input
                  v-for="n in 5"
                  :key="n"
                  type="radio"
                  :value="n"
                  v-model.number="sittersStore.minRating"
                  class="mask mask-star-2 bg-orange-400"
                />
              </div>
              <small class="opacity-60 mt-1">
                {{ sittersStore.minRating > 0 ? `Minim ${sittersStore.minRating} stele` : 'Toate rating-urile' }}
              </small>
            </div>

            <!-- Sortare -->
            <div class="form-control mt-2">
              <label class="label py-1">
                <span class="label-text text-xs font-semibold">SORTARE</span>
              </label>
              <select v-model="sittersStore.sortBy" class="select select-bordered select-sm">
                <option value="rating">⭐ După rating</option>
                <option value="price-asc">💰 Preț crescător</option>
                <option value="price-desc">💸 Preț descrescător</option>
                <option value="experience">💼 Experiență</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      <!-- LISTĂ SITTERS -->
      <div class="lg:col-span-3">
        <!-- Mesaj când nu există rezultate -->
        <div v-if="sittersStore.filteredSitters.length === 0" class="card bg-base-100 shadow-lg">
          <div class="card-body items-center text-center py-16">
            <div class="text-7xl mb-4">😢</div>
            <h3 class="card-title">Nu am găsit niciun sitter</h3>
            <p class="opacity-70">Încearcă să modifici filtrele de căutare</p>
            <button @click="sittersStore.resetFilters" class="btn btn-primary mt-4">
              Resetează filtrele
            </button>
          </div>
        </div>

        <!-- Grid cu sitters -->
        <!-- v-for itererază prin lista filtrată, iar :key optimizează randarea -->
        <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <SitterCard
            v-for="sitter in sittersStore.filteredSitters"
            :key="sitter.id"
            :sitter="sitter"
            @book="handleBook"
          />
        </div>
      </div>
    </div>

    <BookingModal
      :sitter="selectedSitter"
      :open="showBookingModal"
      @close="showBookingModal = false"
    />
  </div>
</template>
