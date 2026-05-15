// Composable pentru gestionarea temei (dark/light mode)
// Composables sunt funcții reutilizabile care încapsulează logică reactivă
// Aceasta este una dintre cele mai puternice caracteristici ale Composition API

import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'

export function useDarkMode() {
  // useStorage din @vueuse/core — persistă automat în localStorage
  // Magic: orice schimbare e salvată instant, fără apeluri manuale
  const theme = useStorage('pawsitter-theme', 'pawsitter')

  // Aplicăm tema pe elementul <html> când se schimbă
  watch(theme, (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme)
  }, { immediate: true })

  // Funcție pentru toggle între cele 2 teme
  function toggleTheme() {
    theme.value = theme.value === 'pawsitter' ? 'dark' : 'pawsitter'
  }

  const isDark = ref(false)
  watch(theme, (val) => {
    isDark.value = val === 'dark'
  }, { immediate: true })

  return { theme, isDark, toggleTheme }
}
