<script setup>
// Componenta SitterCard — card reutilizabil pentru afișarea unui pet sitter
// Demonstrează: props, emits, componente reutilizabile, slot-uri

import { computed } from 'vue'
import { useRouter } from 'vue-router'

// Definim props-urile pe care componenta le primește de la părinte
// Fiecare prop are tip și opțional validare
const props = defineProps({
  sitter: {
    type: Object,
    required: true
  }
})

// defineEmits declară ce evenimente componenta poate emite către părinte
const emit = defineEmits(['book'])

const router = useRouter()

// Computed pentru afișarea ratingului ca stele
const stars = computed(() => {
  const full = Math.floor(props.sitter.rating)
  const hasHalf = props.sitter.rating % 1 >= 0.5
  return { full, hasHalf, empty: 5 - full - (hasHalf ? 1 : 0) }
})

// Iconițe pentru fiecare tip de serviciu
const serviceIcons = {
  'câini': '🐕',
  'pisici': '🐈',
  'iepuri': '🐰',
  'păsări': '🦜',
  'hamsteri': '🐹'
}

function viewProfile() {
  router.push(`/sitters/${props.sitter.id}`)
}

function bookNow() {
  // Emitem un eveniment către componenta părinte
  emit('book', props.sitter)
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl card-hover animate-on-mount overflow-hidden">
    <!-- Header cu avatar și badge de verificare -->
    <div class="relative bg-gradient-to-br from-orange-100 via-amber-50 to-pink-100 p-8 flex justify-center">
      <div class="text-8xl">{{ sitter.avatar }}</div>
      <div v-if="sitter.verified" class="absolute top-3 right-3">
        <div class="badge badge-success gap-1 text-white font-semibold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          Verificat
        </div>
      </div>
    </div>

    <div class="card-body">
      <!-- Nume și locație -->
      <div class="flex justify-between items-start">
        <div>
          <h2 class="card-title text-xl">{{ sitter.name }}</h2>
          <p class="text-sm opacity-70 flex items-center gap-1">
            📍 {{ sitter.location }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-primary">{{ sitter.pricePerDay }} RON</div>
          <div class="text-xs opacity-70">/zi</div>
        </div>
      </div>

      <!-- Rating cu stele -->
      <div class="flex items-center gap-2 mt-2">
        <div class="flex">
          <span v-for="n in stars.full" :key="`full-${n}`" class="text-yellow-400">★</span>
          <span v-if="stars.hasHalf" class="text-yellow-400">⯨</span>
          <span v-for="n in stars.empty" :key="`empty-${n}`" class="text-gray-300">★</span>
        </div>
        <span class="font-semibold">{{ sitter.rating }}</span>
        <span class="text-sm opacity-70">({{ sitter.reviewsCount }} recenzii)</span>
      </div>

      <!-- Bio scurt -->
      <p class="text-sm opacity-80 line-clamp-2 mt-2">{{ sitter.bio }}</p>

      <!-- Servicii (tipuri de animale) -->
      <div class="flex flex-wrap gap-1 mt-3">
        <div
          v-for="service in sitter.services"
          :key="service"
          class="badge badge-outline gap-1"
        >
          <span>{{ serviceIcons[service] }}</span>
          <span class="capitalize">{{ service }}</span>
        </div>
      </div>

      <!-- Experiență -->
      <div class="text-sm opacity-70 mt-1">
        💼 {{ sitter.experience }} {{ sitter.experience === 1 ? 'an' : 'ani' }} experiență
      </div>

      <!-- Butoane acțiuni -->
      <div class="card-actions justify-end mt-4 gap-2">
        <button @click="viewProfile" class="btn btn-outline btn-sm">
          Vezi profil
        </button>
        <!-- Folosim directiva v-tooltip personalizată -->
        <button
          @click="bookNow"
          class="btn btn-primary btn-sm"
          v-tooltip="'Rezervă acum acest pet sitter'"
        >
          Rezervă
        </button>
      </div>
    </div>
  </div>
</template>
