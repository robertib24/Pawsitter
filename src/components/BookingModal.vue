<script setup>
// Modal pentru crearea unei rezervări noi
// Demonstrează: props, emits, validare formular, v-model cu obiecte

import { ref, reactive, computed, watch } from 'vue'
import { useBookingsStore } from '../stores/bookings.js'

const props = defineProps({
  sitter: { type: Object, default: null },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'booked'])

const bookingsStore = useBookingsStore()

// Datele formularului — reactive pentru a fi observabile
const form = reactive({
  petName: '',
  petType: 'câini',
  startDate: '',
  endDate: '',
  notes: ''
})

const errors = reactive({
  petName: '',
  startDate: '',
  endDate: ''
})

const loading = ref(false)
const success = ref(false)

// Calculăm numărul de zile între date — folosim computed pentru reactivitate
const numberOfDays = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  const start = new Date(form.startDate)
  const end = new Date(form.endDate)
  const diff = end - start
  if (diff < 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

// Prețul total — calculat dinamic în funcție de zile
const totalPrice = computed(() => {
  if (!props.sitter || numberOfDays.value === 0) return 0
  return numberOfDays.value * props.sitter.pricePerDay
})

// Data minimă pe care utilizatorul o poate alege (azi)
const minDate = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// Resetăm formularul când modalul se închide
watch(() => props.open, (newValue) => {
  if (!newValue) {
    Object.assign(form, { petName: '', petType: 'câini', startDate: '', endDate: '', notes: '' })
    Object.assign(errors, { petName: '', startDate: '', endDate: '' })
    success.value = false
  }
})

// Validarea câmpurilor formularului
function validate() {
  errors.petName = !form.petName.trim() ? 'Numele animalului este obligatoriu' : ''
  errors.startDate = !form.startDate ? 'Data de început este obligatorie' : ''

  if (!form.endDate) {
    errors.endDate = 'Data de sfârșit este obligatorie'
  } else if (numberOfDays.value <= 0) {
    errors.endDate = 'Data de sfârșit trebuie să fie după data de început'
  } else {
    errors.endDate = ''
  }

  return !errors.petName && !errors.startDate && !errors.endDate
}

// Trimiterea formularului — crearea rezervării
async function handleSubmit() {
  if (!validate()) return

  loading.value = true

  // Simulăm un delay de rețea pentru UX realist
  await new Promise(resolve => setTimeout(resolve, 800))

  bookingsStore.createBooking({
    sitterId: props.sitter.id,
    sitterName: props.sitter.name,
    sitterAvatar: props.sitter.avatar,
    petName: form.petName,
    petType: form.petType,
    startDate: form.startDate,
    endDate: form.endDate,
    notes: form.notes,
    days: numberOfDays.value,
    totalPrice: totalPrice.value
  })

  loading.value = false
  success.value = true

  // Închidem modalul după 2 secunde
  setTimeout(() => {
    emit('booked')
    emit('close')
  }, 2000)
}
</script>

<template>
  <!-- Modal DaisyUI — afișat condițional cu v-if -->
  <div v-if="open" class="modal modal-open">
    <div class="modal-box max-w-lg">
      <!-- Mesaj de succes după rezervare -->
      <div v-if="success" class="text-center py-8 animate-fade-in">
        <div class="text-6xl mb-4">🎉</div>
        <h3 class="text-2xl font-bold text-success mb-2">Rezervare confirmată!</h3>
        <p class="opacity-70">Vei primi un email cu detaliile rezervării.</p>
      </div>

      <!-- Formular de rezervare -->
      <template v-else>
        <button
          @click="emit('close')"
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button>

        <h3 class="font-bold text-2xl mb-4 flex items-center gap-2">
          <span class="text-3xl">{{ sitter?.avatar }}</span>
          Rezervare la {{ sitter?.name }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nume animal -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Numele animalului</span>
            </label>
            <input
              v-model="form.petName"
              v-focus
              type="text"
              placeholder="Ex: Rex, Mishmish..."
              class="input input-bordered"
              :class="{ 'input-error': errors.petName }"
            />
            <label v-if="errors.petName" class="label">
              <span class="label-text-alt text-error">{{ errors.petName }}</span>
            </label>
          </div>

          <!-- Tip animal -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Tipul animalului</span>
            </label>
            <select v-model="form.petType" class="select select-bordered">
              <option value="câini">🐕 Câine</option>
              <option value="pisici">🐈 Pisică</option>
              <option value="iepuri">🐰 Iepure</option>
              <option value="păsări">🦜 Pasăre</option>
              <option value="hamsteri">🐹 Hamster</option>
            </select>
          </div>

          <!-- Date -->
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">De la</span>
              </label>
              <input
                v-model="form.startDate"
                type="date"
                :min="minDate"
                class="input input-bordered"
                :class="{ 'input-error': errors.startDate }"
              />
              <label v-if="errors.startDate" class="label">
                <span class="label-text-alt text-error">{{ errors.startDate }}</span>
              </label>
            </div>

            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Până la</span>
              </label>
              <input
                v-model="form.endDate"
                type="date"
                :min="form.startDate || minDate"
                class="input input-bordered"
                :class="{ 'input-error': errors.endDate }"
              />
              <label v-if="errors.endDate" class="label">
                <span class="label-text-alt text-error">{{ errors.endDate }}</span>
              </label>
            </div>
          </div>

          <!-- Note opționale -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Note (opțional)</span>
            </label>
            <textarea
              v-model="form.notes"
              class="textarea textarea-bordered"
              placeholder="Mențiuni speciale despre animalul tău..."
              rows="3"
            ></textarea>
          </div>

          <!-- Sumar preț -->
          <div v-if="numberOfDays > 0" class="bg-base-200 p-4 rounded-lg">
            <div class="flex justify-between text-sm opacity-80">
              <span>{{ sitter?.pricePerDay }} RON × {{ numberOfDays }} {{ numberOfDays === 1 ? 'zi' : 'zile' }}</span>
              <span>{{ totalPrice }} RON</span>
            </div>
            <div class="divider my-2"></div>
            <div class="flex justify-between text-lg font-bold text-primary">
              <span>Total</span>
              <span>{{ totalPrice }} RON</span>
            </div>
          </div>

          <!-- Butoane acțiuni -->
          <div class="modal-action">
            <button type="button" @click="emit('close')" class="btn btn-ghost">
              Anulează
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading || numberOfDays === 0"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'Se procesează...' : 'Confirmă rezervarea' }}
            </button>
          </div>
        </form>
      </template>
    </div>
    <div class="modal-backdrop bg-black/50" @click="emit('close')"></div>
  </div>
</template>
