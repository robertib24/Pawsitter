<script setup>
// Pagina principală — landing page
// Demonstrează: componente, animații, computed properties, navigare programatică

import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSittersStore } from '../stores/sitters.js'
import SitterCard from '../components/SitterCard.vue'
import BookingModal from '../components/BookingModal.vue'

const router = useRouter()
const sittersStore = useSittersStore()

// Top 3 sitters cu cel mai mare rating — pentru secțiunea "featured"
const topSitters = computed(() => {
  return [...sittersStore.sitters]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
})

// State pentru modal de rezervare
const selectedSitter = ref(null)
const showBookingModal = ref(false)

function handleBook(sitter) {
  selectedSitter.value = sitter
  showBookingModal.value = true
}

function searchSitters() {
  router.push('/sitters')
}
</script>

<template>
  <div>
    <!-- HERO SECTION cu gradient și formă decorativă -->
    <section class="gradient-bg relative overflow-hidden">
      <!-- Forme decorative de fundal -->
      <div class="absolute top-20 left-10 text-9xl opacity-10 animate-bounce-slow">🐾</div>
      <div class="absolute bottom-20 right-10 text-9xl opacity-10">🐾</div>
      <div class="absolute top-40 right-20 text-6xl opacity-10">🦴</div>

      <div class="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Conținut text -->
          <div class="space-y-6 animate-on-mount">
            <div class="badge badge-primary badge-lg gap-1 font-semibold">
              ⭐ #1 platformă de pet sitting din Cluj
            </div>
            <h1 class="text-5xl lg:text-7xl font-bold leading-tight">
              Blănoșii tăi,
              <span class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                în mâini bune
              </span>
            </h1>
            <p class="text-xl opacity-80 leading-relaxed">
              Găsește pet sitters de încredere pentru câinele, pisica sau orice altă vietate dragă.
              Recenzii reale, persoane verificate, totul cu câteva click-uri.
            </p>

            <div class="flex flex-wrap gap-4">
              <button @click="searchSitters" class="btn btn-primary btn-lg gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Caută un sitter
              </button>
              <router-link to="/about" class="btn btn-outline btn-lg">
                Află mai multe
              </router-link>
            </div>

            <!-- Statistici sociale -->
            <div class="flex gap-8 pt-6">
              <div>
                <div class="text-3xl font-bold text-primary">500+</div>
                <div class="text-sm opacity-70">Pet Sitters</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-primary">10k+</div>
                <div class="text-sm opacity-70">Rezervări</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-primary">4.9★</div>
                <div class="text-sm opacity-70">Rating mediu</div>
              </div>
            </div>
          </div>

          <!-- Imagine ilustrativă cu emoji -->
          <div class="relative">
            <div class="card bg-base-100 shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div class="text-center">
                <div class="text-9xl mb-4 animate-bounce-slow">🐕</div>
                <h3 class="font-bold text-2xl">Rex are nevoie de plimbare?</h3>
                <p class="opacity-70 mt-2">Găsești sitter în mai puțin de 2 minute</p>
                <div class="rating rating-lg mt-4">
                  <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
                  <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
                  <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
                  <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
                  <input type="radio" class="mask mask-star-2 bg-orange-400" checked disabled />
                </div>
              </div>
            </div>
            <!-- Card decorative -->
            <div class="absolute -top-4 -right-4 card bg-secondary text-secondary-content p-4 shadow-xl">
              <div class="text-4xl">🐈</div>
            </div>
            <div class="absolute -bottom-4 -left-4 card bg-accent text-accent-content p-4 shadow-xl">
              <div class="text-4xl">🐰</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECȚIUNE "CUM FUNCȚIONEAZĂ" -->
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold mb-4">Cum funcționează?</h2>
          <p class="text-lg opacity-70">Trei pași simpli până la liniștea ta</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="card bg-base-200 card-hover">
            <div class="card-body items-center text-center">
              <div class="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-4xl mb-4">
                🔍
              </div>
              <div class="badge badge-primary mb-2">Pasul 1</div>
              <h3 class="card-title">Caută & Filtrează</h3>
              <p class="opacity-70">Alege locația, tipul de animal și bugetul. Răsfoiește profilele verificate.</p>
            </div>
          </div>

          <div class="card bg-base-200 card-hover">
            <div class="card-body items-center text-center">
              <div class="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center text-4xl mb-4">
                💬
              </div>
              <div class="badge badge-secondary mb-2">Pasul 2</div>
              <h3 class="card-title">Rezervă Direct</h3>
              <p class="opacity-70">Alege datele și confirmă rezervarea online. Plata se face în siguranță.</p>
            </div>
          </div>

          <div class="card bg-base-200 card-hover">
            <div class="card-body items-center text-center">
              <div class="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-4xl mb-4">
                🐾
              </div>
              <div class="badge badge-accent mb-2">Pasul 3</div>
              <h3 class="card-title">Relaxează-te!</h3>
              <p class="opacity-70">Primește poze și update-uri zilnice. Blănosul tău e pe mâini bune.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TOP SITTERS -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold mb-2">Cei mai apreciați sitters</h2>
            <p class="text-lg opacity-70">Profile cu cele mai mari rating-uri</p>
          </div>
          <router-link to="/sitters" class="btn btn-outline btn-primary hidden md:flex">
            Vezi toți
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>

        <!-- Folosim v-for pentru a randa lista de sitters -->
        <!-- :key este obligatoriu pentru optimizarea randării -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SitterCard
            v-for="sitter in topSitters"
            :key="sitter.id"
            :sitter="sitter"
            @book="handleBook"
          />
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="py-20 bg-gradient-to-r from-primary via-orange-500 to-secondary text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-4xl lg:text-5xl font-bold mb-4">
          Gata să oferi blănosului tău cea mai bună grijă?
        </h2>
        <p class="text-xl opacity-90 mb-8">
          Înscrie-te gratuit și găsește sitter-ul perfect în câteva minute
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <router-link to="/register" class="btn btn-lg bg-white text-primary hover:bg-base-200 border-0">
            Creează cont gratuit
          </router-link>
          <router-link to="/sitters" class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary">
            Caută sitters
          </router-link>
        </div>
      </div>
    </section>

    <!-- Modal de rezervare -->
    <BookingModal
      :sitter="selectedSitter"
      :open="showBookingModal"
      @close="showBookingModal = false"
      @booked="showBookingModal = false"
    />
  </div>
</template>
