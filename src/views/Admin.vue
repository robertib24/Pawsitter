<script setup>
// Pagina de administrare — accesibilă doar utilizatorilor cu rolul 'admin'
// Protejată dublu: prin router guard și prin directiva v-permission

import { computed } from 'vue'
import { useSittersStore } from '../stores/sitters.js'
import { useBookingsStore } from '../stores/bookings.js'

const sittersStore = useSittersStore()
const bookingsStore = useBookingsStore()

// Statistici globale platformă
const platformStats = computed(() => {
  const totalRevenue = bookingsStore.bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  return {
    totalSitters: sittersStore.sitters.length,
    verifiedSitters: sittersStore.sitters.filter(s => s.verified).length,
    totalBookings: bookingsStore.bookings.length,
    activeBookings: bookingsStore.bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue,
    avgRating: (sittersStore.sitters.reduce((sum, s) => sum + s.rating, 0) / sittersStore.sitters.length).toFixed(1)
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center gap-2 mb-2">
      <h1 class="text-4xl font-bold">Panou Administrare</h1>
      <div class="badge badge-error badge-lg">ADMIN</div>
    </div>
    <p class="opacity-70 text-lg mb-8">Statistici și management platformă</p>

    <!-- Stats principale -->
    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <div class="card bg-gradient-to-br from-primary to-orange-600 text-white shadow-xl">
        <div class="card-body">
          <div class="text-4xl">👥</div>
          <h3 class="text-sm opacity-90">Total Sitters</h3>
          <p class="text-4xl font-bold">{{ platformStats.totalSitters }}</p>
          <p class="text-xs opacity-80">{{ platformStats.verifiedSitters }} verificați</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-secondary to-blue-600 text-white shadow-xl">
        <div class="card-body">
          <div class="text-4xl">📅</div>
          <h3 class="text-sm opacity-90">Rezervări</h3>
          <p class="text-4xl font-bold">{{ platformStats.totalBookings }}</p>
          <p class="text-xs opacity-80">{{ platformStats.activeBookings }} active</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-accent to-green-600 text-white shadow-xl">
        <div class="card-body">
          <div class="text-4xl">💰</div>
          <h3 class="text-sm opacity-90">Revenue Total</h3>
          <p class="text-4xl font-bold">{{ platformStats.totalRevenue }}</p>
          <p class="text-xs opacity-80">RON</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-warning to-orange-600 text-white shadow-xl">
        <div class="card-body">
          <div class="text-4xl">⭐</div>
          <h3 class="text-sm opacity-90">Rating Mediu</h3>
          <p class="text-4xl font-bold">{{ platformStats.avgRating }}</p>
          <p class="text-xs opacity-80">din 5.0</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-info to-cyan-600 text-white shadow-xl">
        <div class="card-body">
          <div class="text-4xl">✅</div>
          <h3 class="text-sm opacity-90">Verificați</h3>
          <p class="text-4xl font-bold">{{ Math.round(platformStats.verifiedSitters / platformStats.totalSitters * 100) }}%</p>
          <p class="text-xs opacity-80">din total sitters</p>
        </div>
      </div>

      <div class="card bg-gradient-to-br from-error to-pink-600 text-white shadow-xl">
        <div class="card-body">
          <div class="text-4xl">🎯</div>
          <h3 class="text-sm opacity-90">Conversie</h3>
          <p class="text-4xl font-bold">
            {{ platformStats.totalBookings > 0 ? Math.round(platformStats.activeBookings / platformStats.totalBookings * 100) : 0 }}%
          </p>
          <p class="text-xs opacity-80">rezervări active</p>
        </div>
      </div>
    </div>

    <!-- Tabel sitters -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-4">📊 Gestiune Sitters</h2>
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Nume</th>
                <th>Locație</th>
                <th>Servicii</th>
                <th>Rating</th>
                <th>Preț/zi</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sitter in sittersStore.sitters" :key="sitter.id">
                <td class="text-3xl">{{ sitter.avatar }}</td>
                <td class="font-medium">{{ sitter.name }}</td>
                <td>{{ sitter.location }}</td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="s in sitter.services" :key="s" class="badge badge-sm badge-outline">
                      {{ s }}
                    </span>
                  </div>
                </td>
                <td>{{ sitter.rating }} ⭐</td>
                <td>{{ sitter.pricePerDay }} RON</td>
                <td>
                  <span v-if="sitter.verified" class="badge badge-success">Verificat</span>
                  <span v-else class="badge badge-warning">În așteptare</span>
                </td>
                <td>
                  <button class="btn btn-ghost btn-xs" v-tooltip="'Editează'">✏️</button>
                  <button class="btn btn-ghost btn-xs text-error" v-tooltip="'Șterge'">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
