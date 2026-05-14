// Store Pinia pentru gestionarea pet sitters
// Demonstrează: state management, filtre reactive, getters complexe

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSittersStore = defineStore('sitters', () => {
  // STATE
  // Lista pet sitters — date mock pentru demo
  // În producție, acestea ar fi încărcate de la server printr-un API
  const sitters = ref([
    {
      id: 1,
      name: 'Maria Popescu',
      avatar: '👩',
      location: 'Cluj-Napoca',
      rating: 4.9,
      reviewsCount: 127,
      pricePerDay: 80,
      experience: 5,
      services: ['câini', 'pisici'],
      bio: 'Iubesc animalele de mică. Am crescut cu câini și pisici, iar acum mă bucur să am grijă de blănoșii altora!',
      verified: true
    },
    {
      id: 2,
      name: 'Andrei Ionescu',
      avatar: '👨',
      location: 'Cluj-Napoca',
      rating: 4.8,
      reviewsCount: 89,
      pricePerDay: 75,
      experience: 3,
      services: ['câini', 'iepuri'],
      bio: 'Pasionat de câini, fac plimbări lungi zilnic. Specializat în câini mari și energici.',
      verified: true
    },
    {
      id: 3,
      name: 'Elena Marinescu',
      avatar: '👩‍🦰',
      location: 'Florești',
      rating: 5.0,
      reviewsCount: 203,
      pricePerDay: 100,
      experience: 7,
      services: ['câini', 'pisici', 'păsări'],
      bio: 'Medic veterinar cu experiență. Animalele tale sunt în mâini sigure!',
      verified: true
    },
    {
      id: 4,
      name: 'Cristian Munteanu',
      avatar: '🧔',
      location: 'Apahida',
      rating: 4.6,
      reviewsCount: 45,
      pricePerDay: 60,
      experience: 2,
      services: ['câini'],
      bio: 'Student la veterinară, ofer servicii accesibile și de calitate.',
      verified: false
    },
    {
      id: 5,
      name: 'Diana Stanescu',
      avatar: '👩‍🦱',
      location: 'Cluj-Napoca',
      rating: 4.9,
      reviewsCount: 156,
      pricePerDay: 90,
      experience: 6,
      services: ['pisici', 'iepuri', 'hamsteri'],
      bio: 'Specializată în animale de talie mică. Răbdare și grijă pentru fiecare blănos!',
      verified: true
    },
    {
      id: 6,
      name: 'Bogdan Radu',
      avatar: '👨‍🦱',
      location: 'Cluj-Napoca',
      rating: 4.7,
      reviewsCount: 72,
      pricePerDay: 70,
      experience: 4,
      services: ['câini', 'pisici'],
      bio: 'Disponibil și în weekend-uri și sărbători. Trimit poze și update-uri zilnice.',
      verified: true
    }
  ])

  // Filtre — variabile reactive pentru căutare și filtrare
  const searchQuery = ref('')
  const selectedService = ref('')
  const selectedLocation = ref('')
  const maxPrice = ref(200)
  const minRating = ref(0)
  const sortBy = ref('rating') // 'rating', 'price-asc', 'price-desc', 'experience'

  // GETTERS — filtrare și sortare reactive
  // Această proprietate se recalculează automat când oricare filtru se schimbă
  const filteredSitters = computed(() => {
    let result = sitters.value

    // Filtrare după text căutare (în nume sau bio)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.bio.toLowerCase().includes(query)
      )
    }

    // Filtrare după tipul de animal
    if (selectedService.value) {
      result = result.filter(s => s.services.includes(selectedService.value))
    }

    // Filtrare după locație
    if (selectedLocation.value) {
      result = result.filter(s => s.location === selectedLocation.value)
    }

    // Filtrare după preț maxim
    result = result.filter(s => s.pricePerDay <= maxPrice.value)

    // Filtrare după rating minim
    result = result.filter(s => s.rating >= minRating.value)

    // Sortare — facem clonă cu spread operator ca să nu modificăm sursa
    const sorted = [...result]
    switch (sortBy.value) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'price-asc':
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay)
        break
      case 'experience':
        sorted.sort((a, b) => b.experience - a.experience)
        break
    }

    return sorted
  })

  // Locațiile unice — extrase dinamic din lista de sitters
  const locations = computed(() => {
    return [...new Set(sitters.value.map(s => s.location))]
  })

  // Servicii unice (tipurile de animale)
  const services = computed(() => {
    const allServices = sitters.value.flatMap(s => s.services)
    return [...new Set(allServices)]
  })

  // Obținere sitter după ID
  function getSitterById(id) {
    return sitters.value.find(s => s.id === Number(id))
  }

  // Resetare filtre
  function resetFilters() {
    searchQuery.value = ''
    selectedService.value = ''
    selectedLocation.value = ''
    maxPrice.value = 200
    minRating.value = 0
    sortBy.value = 'rating'
  }

  return {
    sitters,
    searchQuery, selectedService, selectedLocation, maxPrice, minRating, sortBy,
    filteredSitters, locations, services,
    getSitterById, resetFilters
  }
})
