<script setup>
// Componentă reutilizabilă StarRating
// Folosește SVG-uri în loc de input radio (mai sigur, fără bug-uri de rendering)
// Suportă rating cu fracțiuni (4.5 stele) prin gradient SVG

import { computed } from 'vue'

const props = defineProps({
  rating: { type: Number, required: true },
  max: { type: Number, default: 5 },
  size: { type: String, default: 'md' }, // 'xs', 'sm', 'md', 'lg', 'xl'
  showValue: { type: Boolean, default: false }
})

// Map de dimensiuni pentru clase Tailwind
const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

// Calculăm ce stele sunt pline, jumătate sau goale
// Returnează un array cu numere între 0 și 1 (procent umplere fiecare stea)
const stars = computed(() => {
  const result = []
  for (let i = 0; i < props.max; i++) {
    const fill = Math.max(0, Math.min(1, props.rating - i))
    result.push(fill)
  }
  return result
})

const starSize = computed(() => sizeClasses[props.size] || sizeClasses.md)
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <div class="flex gap-0.5">
      <!-- Pentru fiecare stea, folosim un SVG cu gradient pentru a permite jumătăți -->
      <svg
        v-for="(fill, index) in stars"
        :key="index"
        :class="starSize"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Gradient unic per stea pentru a permite umplere parțială -->
        <defs>
          <linearGradient :id="`star-${index}-${Math.random()}`" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop :offset="`${fill * 100}%`" stop-color="#fb923c" />
            <stop :offset="`${fill * 100}%`" stop-color="#e5e7eb" />
          </linearGradient>
        </defs>
        <!-- Forma stelei cu fill din gradient -->
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          :fill="fill === 1 ? '#fb923c' : fill === 0 ? '#e5e7eb' : `url(#star-grad-${index})`"
        />
        <!-- Gradient real cu ID stabil -->
        <defs>
          <linearGradient :id="`star-grad-${index}`" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop :offset="`${fill * 100}%`" stop-color="#fb923c" />
            <stop :offset="`${fill * 100}%`" stop-color="#e5e7eb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
    <!-- Valoare opțională afișată lângă stele -->
    <span v-if="showValue" class="font-semibold text-sm">{{ rating.toFixed(1) }}</span>
  </div>
</template>
