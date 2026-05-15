<script setup>
// Pagina cu rezervările utilizatorului
// Demonstrează: filtrare cu tabs, modificarea stării, computed properties

import { ref, computed } from 'vue'
import { useBookingsStore } from '../stores/bookings.js'
import { useToast } from '../composables/useToast.js'

const bookingsStore = useBookingsStore()
const toast = useToast()
const activeFilter = ref('all') // 'all', 'confirmed', 'completed', 'cancelled'

// Filtrăm rezervările în funcție de tab-ul activ
const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') return bookingsStore.myBookings
  return bookingsStore.myBookings.filter(b => b.status === activeFilter.value)
})

// Sortăm rezervările descrescător după dată (cele mai noi primele)
const sortedBookings = computed(() => {
  return [...filteredBookings.value].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

// Formatare dată într-un format prietenos
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Configurare vizuală pentru fiecare status
const statusConfig = {
  confirmed: { label: 'Confirmată', color: 'badge-info', icon: '✓' },
  completed: { label: 'Finalizată', color: 'badge-success', icon: '✅' },
  cancelled: { label: 'Anulată', color: 'badge-error', icon: '✕' }
}

// State pentru modal de confirmare (mai elegant decât confirm() nativ)
const bookingToCancel = ref(null)

function askCancelBooking(id) {
  bookingToCancel.value = id
}

function confirmCancel() {
  if (bookingToCancel.value !== null) {
    bookingsStore.cancelBooking(bookingToCancel.value)
    toast.success('Rezervarea a fost anulată cu succes')
    bookingToCancel.value = null
  }
}

function completeBookingWithToast(id) {
  bookingsStore.completeBooking(id)
  toast.success('Rezervare marcată ca finalizată! 🎉')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold mb-2">Rezervările mele 📅</h1>
    <p class="opacity-70 text-lg mb-8">Gestionează toate rezervările tale într-un singur loc</p>

    <!-- Statistici cu cards -->
    <div class="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">
      <div class="stat">
        <div class="stat-figure text-primary text-3xl">📋</div>
        <div class="stat-title">Total</div>
        <div class="stat-value text-primary">{{ bookingsStore.stats.total }}</div>
        <div class="stat-desc">Rezervări create</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-info text-3xl">⏳</div>
        <div class="stat-title">Active</div>
        <div class="stat-value text-info">{{ bookingsStore.stats.active }}</div>
        <div class="stat-desc">Așteaptă să înceapă</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-success text-3xl">✅</div>
        <div class="stat-title">Finalizate</div>
        <div class="stat-value text-success">{{ bookingsStore.stats.completed }}</div>
        <div class="stat-desc">Cu succes</div>
      </div>
      <div class="stat">
        <div class="stat-figure text-error text-3xl">✕</div>
        <div class="stat-title">Anulate</div>
        <div class="stat-value text-error">{{ bookingsStore.stats.cancelled }}</div>
        <div class="stat-desc">Total anulate</div>
      </div>
    </div>

    <!-- Tabs pentru filtre -->
    <div class="tabs tabs-boxed bg-base-100 shadow p-2 mb-6 inline-flex">
      <a @click="activeFilter = 'all'" class="tab tab-lg" :class="{ 'tab-active': activeFilter === 'all' }">
        Toate ({{ bookingsStore.stats.total }})
      </a>
      <a @click="activeFilter = 'confirmed'" class="tab tab-lg" :class="{ 'tab-active': activeFilter === 'confirmed' }">
        Active
      </a>
      <a @click="activeFilter = 'completed'" class="tab tab-lg" :class="{ 'tab-active': activeFilter === 'completed' }">
        Finalizate
      </a>
      <a @click="activeFilter = 'cancelled'" class="tab tab-lg" :class="{ 'tab-active': activeFilter === 'cancelled' }">
        Anulate
      </a>
    </div>

    <!-- Mesaj când nu există rezervări -->
    <div v-if="sortedBookings.length === 0" class="card bg-base-100 shadow-lg">
      <div class="card-body items-center text-center py-16">
        <div class="text-7xl mb-4">📭</div>
        <h3 class="card-title">Nu există rezervări încă</h3>
        <p class="opacity-70">Începe prin a căuta un pet sitter pentru blănosul tău!</p>
        <router-link to="/sitters" class="btn btn-primary mt-4">
          Caută un sitter
        </router-link>
      </div>
    </div>

    <!-- Lista de rezervări -->
    <div v-else class="space-y-4">
      <div
        v-for="booking in sortedBookings"
        :key="booking.id"
        class="card bg-base-100 shadow-lg card-hover"
      >
        <div class="card-body">
          <div class="flex flex-col lg:flex-row gap-4">
            <!-- Avatar sitter -->
            <div class="text-6xl">{{ booking.sitterAvatar }}</div>

            <!-- Detalii rezervare -->
            <div class="flex-1">
              <div class="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <h3 class="font-bold text-xl">{{ booking.sitterName }}</h3>
                  <p class="opacity-70 text-sm">
                    Pentru {{ booking.petName }} ({{ booking.petType }})
                  </p>
                </div>
                <div :class="['badge gap-1', statusConfig[booking.status].color]">
                  {{ statusConfig[booking.status].icon }} {{ statusConfig[booking.status].label }}
                </div>
              </div>

              <div class="grid sm:grid-cols-3 gap-4 mt-4 text-sm">
                <div>
                  <div class="opacity-60 text-xs">PERIOADĂ</div>
                  <div class="font-medium">
                    {{ formatDate(booking.startDate) }} → {{ formatDate(booking.endDate) }}
                  </div>
                </div>
                <div>
                  <div class="opacity-60 text-xs">DURATĂ</div>
                  <div class="font-medium">{{ booking.days }} {{ booking.days === 1 ? 'zi' : 'zile' }}</div>
                </div>
                <div>
                  <div class="opacity-60 text-xs">TOTAL</div>
                  <div class="font-bold text-primary text-lg">{{ booking.totalPrice }} RON</div>
                </div>
              </div>

              <div v-if="booking.notes" class="bg-base-200 p-3 rounded-lg mt-3 text-sm">
                <strong>📝 Note:</strong> {{ booking.notes }}
              </div>
            </div>
          </div>

          <!-- Acțiuni -->
          <div class="card-actions justify-end mt-2">
            <button
              v-if="booking.status === 'confirmed'"
              @click="askCancelBooking(booking.id)"
              class="btn btn-outline btn-error btn-sm"
            >
              Anulează
            </button>
            <button
              v-if="booking.status === 'confirmed'"
              @click="completeBookingWithToast(booking.id)"
              class="btn btn-outline btn-success btn-sm"
            >
              Marchează ca finalizată
            </button>
            <router-link
              :to="`/sitters/${booking.sitterId}`"
              class="btn btn-ghost btn-sm"
            >
              Vezi profil sitter
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmare anulare — mai elegant decât confirm() native -->
    <div v-if="bookingToCancel !== null" class="modal modal-open">
      <div class="modal-box">
        <div class="text-center">
          <div class="text-6xl mb-4">😢</div>
          <h3 class="font-bold text-xl mb-2">Anulezi rezervarea?</h3>
          <p class="opacity-70">Această acțiune nu poate fi anulată. Ești sigur că vrei să continui?</p>
        </div>
        <div class="modal-action justify-center">
          <button @click="bookingToCancel = null" class="btn btn-ghost">
            Nu, păstrez rezervarea
          </button>
          <button @click="confirmCancel" class="btn btn-error">
            Da, anulează
          </button>
        </div>
      </div>
      <div class="modal-backdrop bg-black/50" @click="bookingToCancel = null"></div>
    </div>
  </div>
</template>
