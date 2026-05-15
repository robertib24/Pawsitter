<script setup>
// Pagina principală — landing page cu animații avansate
// Folosește @vueuse/motion pentru animații declarative și GSAP pentru efecte complexe

import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMouse, useScroll } from '@vueuse/core'
import gsap from 'gsap'
import { useSittersStore } from '../stores/sitters.js'
import SitterCard from '../components/SitterCard.vue'
import BookingModal from '../components/BookingModal.vue'
import StarRating from '../components/StarRating.vue'

const router = useRouter()
const sittersStore = useSittersStore()

// Top 3 sitters cu cel mai mare rating
const topSitters = computed(() => {
  return [...sittersStore.sitters]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
})

const selectedSitter = ref(null)
const showBookingModal = ref(false)

// @vueuse/core — tracking poziție mouse și scroll pentru parallax effects
const { x: mouseX, y: mouseY } = useMouse()
const { y: scrollY } = useScroll(window)

// Parallax computed — blob-urile se mișcă subtil în funcție de poziția mouse-ului
// Creează un efect modern de profunzime și interactivitate
const parallaxBlob1 = computed(() => ({
  transform: `translate(${mouseX.value * 0.02}px, ${mouseY.value * 0.02}px)`
}))
const parallaxBlob2 = computed(() => ({
  transform: `translate(${-mouseX.value * 0.03}px, ${-mouseY.value * 0.03}px)`
}))
const parallaxBlob3 = computed(() => ({
  transform: `translate(${mouseX.value * 0.015}px, ${-mouseY.value * 0.015}px)`
}))

// Hero scroll parallax — efectul "se topește" la scroll
const heroParallax = computed(() => ({
  transform: `translateY(${scrollY.value * 0.3}px)`,
  opacity: Math.max(0, 1 - scrollY.value / 600)
}))

function handleBook(sitter) {
  selectedSitter.value = sitter
  showBookingModal.value = true
}

function searchSitters() {
  router.push('/sitters')
}

// Referințe pentru counter-ele animate
const statsRefs = ref({ sitters: null, bookings: null, rating: null })

onMounted(() => {
  // Animație counter cu GSAP — numerele urcă progresiv cu easing
  // Efect cinematic, exact ca pe site-urile mari (Stripe, Vercel)
  const counters = [
    { ref: statsRefs.value.sitters, target: 500, suffix: '+' },
    { ref: statsRefs.value.bookings, target: 10000, suffix: '+', format: true },
    { ref: statsRefs.value.rating, target: 4.9, suffix: '★', decimals: 1 }
  ]

  counters.forEach((counter) => {
    if (!counter.ref) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: counter.target,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        let value = counter.decimals ? obj.val.toFixed(counter.decimals) : Math.floor(obj.val)
        if (counter.format && Number(value) >= 1000) value = `${(Number(value) / 1000).toFixed(0)}k`
        counter.ref.textContent = value + counter.suffix
      }
    })
  })
})
</script>

<template>
  <div>
    <!-- HERO SECTION cu parallax la mouse, animații motion și design premium -->
    <section class="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 min-h-screen flex items-center">
      <!-- Mesh gradient blobs cu parallax la mouse -->
      <div class="absolute top-0 -left-32 w-[500px] h-[500px] bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse transition-transform duration-300" :style="parallaxBlob1"></div>
      <div class="absolute top-32 -right-32 w-[500px] h-[500px] bg-secondary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse transition-transform duration-300" style="animation-delay: 2s" :style="parallaxBlob2"></div>
      <div class="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse transition-transform duration-300" style="animation-delay: 4s" :style="parallaxBlob3"></div>

      <!-- Paw prints decorative cu animație float -->
      <div class="absolute top-20 left-10 text-7xl opacity-10 select-none animate-float">🐾</div>
      <div class="absolute bottom-20 right-10 text-7xl opacity-10 select-none animate-float-delayed">🐾</div>
      <div class="absolute top-40 right-32 text-5xl opacity-10 select-none animate-float">🦴</div>

      <div class="container mx-auto px-4 py-20 relative z-10" :style="heroParallax">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Conținut text cu animații staggered prin v-motion -->
          <div class="space-y-8">
            <!-- Badge cu animație de slide -->
            <div
              v-motion
              :initial="{ opacity: 0, y: -30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
              class="inline-flex items-center gap-2 badge badge-primary badge-lg font-semibold py-4 px-5 shadow-lg shadow-primary/30"
            >
              <span class="animate-pulse">⭐</span>
              #1 platformă de pet sitting din Cluj
            </div>

            <!-- TITLU - fix la spacing pentru diacritice ă, â, î -->
            <!-- Folosim line-height: 1.2 (în loc de leading-tight care era 1.0) -->
            <!-- și block pe span-uri ca să nu se suprapună rândurile -->
            <h1
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 200 } }"
              class="text-5xl lg:text-7xl font-extrabold tracking-tight"
              style="line-height: 1.2;"
            >
              <span class="block pb-2">Blănoșii tăi,</span>
              <span class="block pb-2 bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent">
                în mâini bune
              </span>
            </h1>

            <!-- Descriere -->
            <p
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
              class="text-xl opacity-80 leading-relaxed max-w-xl"
            >
              Găsește pet sitters de încredere pentru câinele, pisica sau orice altă vietate dragă.
              <span class="font-semibold">Recenzii reale</span>, persoane verificate, totul cu câteva click-uri.
            </p>

            <!-- Butoane cu hover effects moderne -->
            <div
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 600 } }"
              class="flex flex-wrap gap-4"
            >
              <button
                @click="searchSitters"
                class="btn btn-primary btn-lg gap-2 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Caută un sitter
              </button>
              <router-link
                to="/about"
                class="btn btn-outline btn-lg hover:bg-base-100 hover:scale-105 transition-all duration-300"
              >
                Află mai multe →
              </router-link>
            </div>

            <!-- Statistici animate cu GSAP — counter cinematic -->
            <div
              v-motion
              :initial="{ opacity: 0, y: 30 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 800 } }"
              class="flex gap-8 pt-8 border-t border-base-content/10"
            >
              <div>
                <div :ref="el => statsRefs.sitters = el" class="text-4xl font-extrabold text-primary">0+</div>
                <div class="text-sm opacity-70 font-medium">Pet Sitters</div>
              </div>
              <div>
                <div :ref="el => statsRefs.bookings = el" class="text-4xl font-extrabold text-primary">0+</div>
                <div class="text-sm opacity-70 font-medium">Rezervări</div>
              </div>
              <div>
                <div :ref="el => statsRefs.rating = el" class="text-4xl font-extrabold text-primary">0★</div>
                <div class="text-sm opacity-70 font-medium">Rating mediu</div>
              </div>
            </div>
          </div>

          <!-- Card 3D ilustrativ cu floating elements și animație stagger -->
          <div class="relative h-[500px] hidden lg:block">
            <!-- Card principal cu efect tilt -->
            <div
              v-motion
              :initial="{ opacity: 0, scale: 0.8, rotate: -10 }"
              :enter="{ opacity: 1, scale: 1, rotate: 2, transition: { duration: 800, delay: 400 } }"
              class="absolute top-10 left-1/2 -translate-x-1/2 card bg-base-100 shadow-2xl p-8 w-80 hover:rotate-0 transition-transform duration-500 z-20 hover:scale-105"
            >
              <div class="text-center">
                <div class="text-8xl mb-4 animate-bounce-slow">🐕</div>
                <h3 class="font-bold text-2xl">Max are nevoie de plimbare?</h3>
                <p class="opacity-70 mt-2">Găsești sitter în mai puțin de 2 minute</p>
                <StarRating :rating="5" size="lg" class="mt-4 justify-center" />
              </div>
            </div>

            <!-- Cards floating decorative cu intrare stagger -->
            <div
              v-motion
              :initial="{ opacity: 0, x: 100, scale: 0 }"
              :enter="{ opacity: 1, x: 0, scale: 1, transition: { duration: 600, delay: 700 } }"
              class="absolute top-0 right-10 card bg-secondary text-secondary-content p-4 shadow-xl z-10 hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer"
            >
              <div class="text-5xl">🐈</div>
            </div>

            <div
              v-motion
              :initial="{ opacity: 0, x: -100, scale: 0 }"
              :enter="{ opacity: 1, x: 0, scale: 1, transition: { duration: 600, delay: 900 } }"
              class="absolute bottom-20 left-0 card bg-accent text-accent-content p-4 shadow-xl z-10 hover:scale-125 hover:-rotate-12 transition-all duration-300 cursor-pointer"
            >
              <div class="text-5xl">🐰</div>
            </div>

            <div
              v-motion
              :initial="{ opacity: 0, y: 100, scale: 0 }"
              :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 600, delay: 1100 } }"
              class="absolute bottom-0 right-20 card bg-primary text-primary-content p-4 shadow-xl z-10 hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer"
            >
              <div class="text-5xl">🦜</div>
            </div>

            <div
              v-motion
              :initial="{ opacity: 0, scale: 0 }"
              :enter="{ opacity: 1, scale: 1, transition: { duration: 600, delay: 1300 } }"
              class="absolute top-32 right-0 card bg-warning text-warning-content p-3 shadow-xl z-10 hover:scale-125 hover:-rotate-12 transition-all duration-300 cursor-pointer"
            >
              <div class="text-3xl">🦴</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave separator -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" class="w-full h-12" preserveAspectRatio="none">
          <path d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z" fill="#ffffff"/>
        </svg>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div class="flex flex-col items-center gap-2 opacity-50">
          <span class="text-xs uppercase tracking-widest font-semibold">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>

    <!-- SECȚIUNE "CUM FUNCȚIONEAZĂ" cu animații la scroll -->
    <section class="py-24 bg-base-100">
      <div class="container mx-auto px-4">
        <div
          v-motion
          :initial="{ opacity: 0, y: 50 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="text-center mb-16"
        >
          <div class="badge badge-primary mb-3">PROCES SIMPLU</div>
          <h2 class="text-4xl lg:text-5xl font-bold mb-4" style="line-height: 1.2;">Cum funcționează?</h2>
          <p class="text-lg opacity-70">Trei pași simpli până la liniștea ta</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Linie conectoare gradient (doar desktop) -->
          <div class="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30 z-0"></div>

          <div
            v-motion
            :initial="{ opacity: 0, y: 80 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
            class="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative z-10 border-2 border-base-200"
          >
            <div class="card-body items-center text-center">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-5xl mb-4 shadow-lg shadow-primary/30 hover:rotate-12 transition-transform duration-300">
                🔍
              </div>
              <div class="badge badge-primary mb-2 font-bold">PASUL 1</div>
              <h3 class="card-title text-2xl">Caută & Filtrează</h3>
              <p class="opacity-70">Alege locația, tipul de animal și bugetul. Răsfoiește profilele verificate ale sitter-ilor.</p>
            </div>
          </div>

          <div
            v-motion
            :initial="{ opacity: 0, y: 80 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }"
            class="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative z-10 border-2 border-base-200"
          >
            <div class="card-body items-center text-center">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-blue-500 flex items-center justify-center text-5xl mb-4 shadow-lg shadow-secondary/30 hover:rotate-12 transition-transform duration-300">
                💬
              </div>
              <div class="badge badge-secondary mb-2 font-bold">PASUL 2</div>
              <h3 class="card-title text-2xl">Rezervă Direct</h3>
              <p class="opacity-70">Alege datele și confirmă rezervarea online. Plata se face în siguranță, totul digital.</p>
            </div>
          </div>

          <div
            v-motion
            :initial="{ opacity: 0, y: 80 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 500 } }"
            class="card bg-base-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative z-10 border-2 border-base-200"
          >
            <div class="card-body items-center text-center">
              <div class="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-green-500 flex items-center justify-center text-5xl mb-4 shadow-lg shadow-accent/30 hover:rotate-12 transition-transform duration-300">
                🐾
              </div>
              <div class="badge badge-accent mb-2 font-bold">PASUL 3</div>
              <h3 class="card-title text-2xl">Relaxează-te!</h3>
              <p class="opacity-70">Primește poze și update-uri zilnice. Blănosul tău e pe mâini bune, tu poți fi liniștit.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TOP SITTERS cu animații stagger -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 600 } }"
          class="flex justify-between items-end mb-12"
        >
          <div>
            <h2 class="text-4xl lg:text-5xl font-bold mb-2" style="line-height: 1.2;">Cei mai apreciați sitters</h2>
            <p class="text-lg opacity-70">Profile cu cele mai mari rating-uri</p>
          </div>
          <router-link to="/sitters" class="btn btn-outline btn-primary hidden md:flex">
            Vezi toți
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(sitter, index) in topSitters"
            :key="sitter.id"
            v-motion
            :initial="{ opacity: 0, y: 60 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: index * 150 } }"
          >
            <SitterCard :sitter="sitter" @book="handleBook" />
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALE -->
    <section class="py-24 bg-base-100">
      <div class="container mx-auto px-4">
        <div
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
          class="text-center mb-12"
        >
          <div class="badge badge-secondary mb-3">RECENZII</div>
          <h2 class="text-4xl lg:text-5xl font-bold mb-4" style="line-height: 1.2;">Ce spun utilizatorii noștri</h2>
          <p class="text-lg opacity-70">Povești reale de la oameni reali</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="(testimonial, index) in [
              { stars: 5, text: 'Am plecat în vacanță liniștită știind că Mishmish e în mâini bune. Maria mi-a trimis poze zilnic și pisica mea s-a simțit ca acasă!', avatar: '👩', name: 'Ana Mihaela', location: 'Cluj-Napoca', pet: '🐈' },
              { stars: 5, text: 'Cea mai sigură soluție pentru câinele meu când lipsesc. Sitters verificați, recenzii reale, totul super profesional. Recomand!', avatar: '🧔', name: 'Mihai Radu', location: 'Florești', pet: '🐕' },
              { stars: 5, text: 'Platforma e super intuitivă, am găsit sitter în 5 minute. Prețuri corecte și mai ales oameni cărora chiar le pasă de animale.', avatar: '👩‍🦰', name: 'Cristina Popa', location: 'Cluj-Napoca', pet: '🐰' }
            ]"
            :key="index"
            v-motion
            :initial="{ opacity: 0, scale: 0.9, y: 40 }"
            :visible-once="{ opacity: 1, scale: 1, y: 0, transition: { duration: 600, delay: index * 200 } }"
            class="card bg-base-200 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
          >
            <!-- Citat decorativ -->
            <div class="absolute top-4 right-4 text-6xl opacity-10 font-serif leading-none">"</div>

            <div class="card-body">
              <StarRating :rating="testimonial.stars" size="md" class="mb-2" />
              <p class="italic opacity-80 relative z-10">"{{ testimonial.text }}"</p>
              <div class="flex items-center gap-3 mt-4">
                <div class="text-4xl">{{ testimonial.avatar }}</div>
                <div>
                  <div class="font-bold">{{ testimonial.name }}</div>
                  <div class="text-xs opacity-60">{{ testimonial.location }} • {{ testimonial.pet }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL cu design dramatic -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary via-orange-500 to-pink-500"></div>
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>

      <div class="absolute top-10 left-10 text-9xl opacity-10 text-white animate-float">🐾</div>
      <div class="absolute bottom-10 right-10 text-9xl opacity-10 text-white animate-float-delayed">🐾</div>

      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.9 }"
        :visible-once="{ opacity: 1, scale: 1, transition: { duration: 800 } }"
        class="container mx-auto px-4 text-center relative z-10 text-white"
      >
        <div class="text-7xl mb-4 animate-bounce-slow inline-block">🐾</div>
        <h2 class="text-4xl lg:text-6xl font-extrabold mb-4" style="line-height: 1.2;">
          <span class="block pb-1">Gata să oferi blănosului tău</span>
          <span class="block">cea mai bună grijă?</span>
        </h2>
        <p class="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Înscrie-te gratuit și găsește sitter-ul perfect în câteva minute.
          Fără taxe ascunse, doar grijă autentică.
        </p>
        <div class="flex gap-4 justify-center flex-wrap">
          <router-link
            to="/register"
            class="btn btn-lg bg-white text-primary hover:bg-base-200 border-0 shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            🚀 Creează cont gratuit
          </router-link>
          <router-link
            to="/sitters"
            class="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
          >
            Caută sitters →
          </router-link>
        </div>
        <p class="text-sm opacity-80 mt-6">
          ✓ Fără card de credit necesar &nbsp;•&nbsp; ✓ Anulare oricând &nbsp;•&nbsp; ✓ 100% sigur
        </p>
      </div>
    </section>

    <BookingModal
      :sitter="selectedSitter"
      :open="showBookingModal"
      @close="showBookingModal = false"
      @booked="showBookingModal = false"
    />
  </div>
</template>

<style scoped>
/* Animații custom pentru elementele float — efect mai natural decât bounce */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite 1s;
}
</style>
