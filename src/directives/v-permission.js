// Directivă personalizată: v-permission
// Afișează elementul doar dacă utilizatorul are rolul cerut
// Folosire: <button v-permission="'admin'">Acțiune admin</button>

// Directivă utilă pentru autorizare la nivel de UI — ascunde elemente sensibile
// pentru utilizatorii care nu au permisiunile necesare
import { useAuthStore } from '../stores/auth.js'

export const permissionDirective = {
  // mounted — verificăm permisiunile la prima randare
  mounted(el, binding) {
    checkPermission(el, binding)
  },

  // updated — reverificăm dacă valoarea sau starea utilizatorului se schimbă
  updated(el, binding) {
    checkPermission(el, binding)
  }
}

// Funcție helper care decide dacă elementul trebuie afișat sau ascuns
function checkPermission(el, binding) {
  const requiredRole = binding.value
  const authStore = useAuthStore()
  const userRole = authStore.user?.role

  if (userRole !== requiredRole) {
    // Folosim display: none pentru a-l ascunde vizual, păstrându-l în DOM
    el.style.display = 'none'
  } else {
    el.style.display = ''
  }
}
