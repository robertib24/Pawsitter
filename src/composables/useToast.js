// Composable pentru sistemul de toast notifications
// Înlocuiește alert()/confirm() native cu notificări frumoase
// State-ul e shared între toate componentele care apelează useToast()

import { ref } from 'vue'

// State-ul e DEFINIT ÎN AFARA funcției — singleton pattern
// Toate componentele care folosesc useToast() partajează aceleași toast-uri
const toasts = ref([])
let nextId = 0

export function useToast() {
  // Adaugă un toast nou cu timeout auto-dismiss
  function showToast(message, type = 'info', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })

    // Auto-dismiss după duration ms
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  // Helpere convenabile pentru fiecare tip
  const success = (msg, duration) => showToast(msg, 'success', duration)
  const error = (msg, duration) => showToast(msg, 'error', duration)
  const info = (msg, duration) => showToast(msg, 'info', duration)
  const warning = (msg, duration) => showToast(msg, 'warning', duration)

  return { toasts, showToast, removeToast, success, error, info, warning }
}
