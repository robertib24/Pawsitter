<script setup>
// Pagina de detalii a unui sitter
// Demonstrează: route params, props, navigare programatică

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import { useSittersStore } from '../stores/sitters.js'
import BookingModal from '../components/BookingModal.vue'

// props.id vine automat din URL-ul rutei /sitters/:id
// Aceasta funcționează deoarece am setat props: true în router
const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const router = useRouter()
const authStore = useAuthStore()
const sittersStore = useSittersStore()

// Obținem sitter-ul după ID
const sitter = computed(() => sittersStore.getSitterById(props.id))

const showBookingModal = ref(false)
const activeTab = ref('about')

// Recenzii mock pentru demo
const reviews = ref([
  {
    id: 1,
    user: 'Ana M.',
    rating: 5,
    date: '2026-04-15',
    text: 'Excelentă! Câinele meu s-a simțit ca acasă. Recomand cu încredere!'
  },
  {
    id: 2,
    user: 'Mihai R.',
    rating: 5,
    date: '2026-03-22',
    text: 'Profesionistă și atentă la detalii. Am primit poze zilnic.'
  },
  {
    id: 3,
    user: 'Cristina V.',
    rating: 4,
    date: '2026-02-10',
    text: 'Foarte mulțumită. Pisica mea s-a împrietenit imediat cu ea.'
  }
])

function handleBook() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: `/sitters/${props.id}` } })
    return
  }
  showBookingModal.value = true
}

function goBack() {
  router.back()
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Sitter inexistent -->
    <div v-if="!sitter" class="card bg-base-100 shadow-lg">
      <div class="card-body items-center text-center py-16">
        <div class="text-7xl mb-4">🔍</div>
        <h2 class="card-title">Sitter inexistent</h2>
        <p class="opacity-70">Sitter-ul cu ID-ul {{ id }} nu a fost găsit.</p>
        <router-link to="/sitters" class="btn btn-primary mt-4">
          Înapoi la listă
        </router-link>
      </div>
    </div>

    <div v-else>
      <!-- Buton înapoi -->
      <button @click="goBack" class="btn btn-ghost btn-sm gap-1 mb-4">
        ← Înapoi
      </button>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Coloana principală -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Header card cu avatar -->
          <div class="card bg-base-100 shadow-xl overflow-hidden">
            <div class="bg-gradient-to-br from-orange-100 via-amber-50 to-pink-100 p-12 text-center relative">
              <div class="text-9xl mb-4">{{ sitter.avatar }}</div>
              <div v-if="sitter.verified" class="absolute top-4 right-4 badge badge-success gap-1 text-white">
                ✓ Verificat
              </div>
            </div>
            <div class="card-body">
              <div class="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h1 class="text-3xl font-bold">{{ sitter.name }}</h1>
                  <p class="opacity-70 mt-1">📍 {{ sitter.location }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="rating rating-sm">
                      <input v-for="n in 5" :key="n" type="radio" disabled :checked="n === Math.round(sitter.rating)" class="mask mask-star-2 bg-orange-400" />
                    </div>
                    <span class="font-bold">{{ sitter.rating }}</span>
                    <span class="opacity-70">({{ sitter.reviewsCount }} recenzii)</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-4xl font-bold text-primary">{{ sitter.pricePerDay }} RON</div>
                  <div class="text-sm opacity-70">pe zi</div>
                </div>
              </div>

              <!-- Tab-uri -->
              <div class="tabs tabs-boxed mt-4">
                <a
                  @click="activeTab = 'about'"
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'about' }"
                >
                  Despre
                </a>
                <a
                  @click="activeTab = 'services'"
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'services' }"
                >
                  Servicii
                </a>
                <a
                  @click="activeTab = 'reviews'"
                  class="tab"
                  :class="{ 'tab-active': activeTab === 'reviews' }"
                >
                  Recenzii
                </a>
              </div>

              <!-- Conținut tab -->
              <div class="mt-4 min-h-[200px]">
                <!-- Despre -->
                <div v-if="activeTab === 'about'" class="animate-fade-in">
                  <h3 class="font-bold text-lg mb-2">Despre {{ sitter.name.split(' ')[0] }}</h3>
                  <p class="opacity-80 leading-relaxed">{{ sitter.bio }}</p>

                  <div class="stats stats-horizontal shadow mt-6 w-full">
                    <div class="stat">
                      <div class="stat-title text-xs">Experiență</div>
                      <div class="stat-value text-2xl text-primary">{{ sitter.experience }} ani</div>
                    </div>
                    <div class="stat">
                      <div class="stat-title text-xs">Rating</div>
                      <div class="stat-value text-2xl text-primary">{{ sitter.rating }} ⭐</div>
                    </div>
                    <div class="stat">
                      <div class="stat-title text-xs">Recenzii</div>
                      <div class="stat-value text-2xl text-primary">{{ sitter.reviewsCount }}</div>
                    </div>
                  </div>
                </div>

                <!-- Servicii -->
                <div v-else-if="activeTab === 'services'" class="animate-fade-in">
                  <h3 class="font-bold text-lg mb-3">Animale de care am grijă</h3>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="service in sitter.services"
                      :key="service"
                      class="badge badge-primary badge-lg gap-1 capitalize"
                    >
                      {{ service }}
                    </div>
                  </div>

                  <h3 class="font-bold text-lg mt-6 mb-3">Servicii oferite</h3>
                  <ul class="space-y-2">
                    <li class="flex items-center gap-2">✅ Plimbări zilnice</li>
                    <li class="flex items-center gap-2">✅ Hrănire și apă proaspătă</li>
                    <li class="flex items-center gap-2">✅ Joacă și companie</li>
                    <li class="flex items-center gap-2">✅ Update-uri cu poze și video</li>
                    <li class="flex items-center gap-2">✅ Administrare medicamente (la nevoie)</li>
                  </ul>
                </div>

                <!-- Recenzii -->
                <div v-else-if="activeTab === 'reviews'" class="animate-fade-in space-y-3">
                  <div v-for="review in reviews" :key="review.id" class="card bg-base-200">
                    <div class="card-body p-4">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="font-semibold">{{ review.user }}</div>
                          <div class="rating rating-xs">
                            <input v-for="n in 5" :key="n" type="radio" disabled :checked="n === review.rating" class="mask mask-star-2 bg-orange-400" />
                          </div>
                        </div>
                        <span class="text-xs opacity-60">{{ review.date }}</span>
                      </div>
                      <p class="text-sm opacity-80 mt-2">{{ review.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar cu CTA -->
        <aside class="lg:col-span-1">
          <div class="card bg-base-100 shadow-xl sticky top-24">
            <div class="card-body">
              <h3 class="card-title">Rezervă acum</h3>
              <p class="opacity-70 text-sm">
                Ești la doar câteva click-uri distanță de liniștea ta sufletească!
              </p>

              <div class="divider"></div>

              <div class="flex justify-between items-center">
                <span class="opacity-70">Preț/zi</span>
                <span class="text-2xl font-bold text-primary">{{ sitter.pricePerDay }} RON</span>
              </div>

              <button
                @click="handleBook"
                class="btn btn-primary btn-block btn-lg mt-4"
                v-tooltip:bottom="'Click pentru a deschide formularul de rezervare'"
              >
                Rezervă acum
              </button>

              <div class="text-center text-xs opacity-60 mt-2">
                🛡️ Plată sigură • 🔄 Anulare gratuită
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <BookingModal
      :sitter="sitter"
      :open="showBookingModal"
      @close="showBookingModal = false"
    />
  </div>
</template>
