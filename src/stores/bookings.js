// Store Pinia pentru rezervări (bookings)
// Permite crearea, vizualizarea și anularea rezervărilor de pet sitting

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth.js'

export const useBookingsStore = defineStore('bookings', () => {
  // STATE — lista rezervărilor
  // În producție, acestea ar veni de la server
  const bookings = ref(JSON.parse(localStorage.getItem('bookings') || '[]'))

  // GETTERS
  // Rezervările utilizatorului curent
  const myBookings = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.user) return []
    return bookings.value.filter(b => b.userId === authStore.user.id)
  })

  // Statistici despre rezervări
  const stats = computed(() => ({
    total: myBookings.value.length,
    active: myBookings.value.filter(b => b.status === 'confirmed').length,
    completed: myBookings.value.filter(b => b.status === 'completed').length,
    cancelled: myBookings.value.filter(b => b.status === 'cancelled').length
  }))

  // ACTIONS
  // Creare rezervare nouă
  function createBooking(bookingData) {
    const authStore = useAuthStore()
    const newBooking = {
      id: Date.now(), // ID simplu pe bază de timestamp
      userId: authStore.user.id,
      userName: authStore.user.name,
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    bookings.value.push(newBooking)
    persist()
    return newBooking
  }

  // Anulare rezervare
  function cancelBooking(id) {
    const booking = bookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = 'cancelled'
      persist()
    }
  }

  // Marcare rezervare ca finalizată
  function completeBooking(id) {
    const booking = bookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = 'completed'
      persist()
    }
  }

  // Persistare în localStorage pentru a păstra datele între refresh-uri
  function persist() {
    localStorage.setItem('bookings', JSON.stringify(bookings.value))
  }

  return {
    bookings, myBookings, stats,
    createBooking, cancelBooking, completeBooking
  }
})
