<script setup>
// Container pentru notificări toast
// Se montează o singură dată în App.vue și afișează toate toast-urile active
// Demonstrează: TransitionGroup pentru animații pe liste

import { useToast } from '../composables/useToast.js'

const { toasts, removeToast } = useToast()

// Map de iconițe pentru fiecare tip
const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️'
}

// Map de clase DaisyUI pentru styling
const alertClass = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
  warning: 'alert-warning'
}
</script>

<template>
  <!-- Container fixed în colțul de sus dreapta -->
  <div class="toast toast-top toast-end z-[100]">
    <!-- TransitionGroup animează intrarea/ieșirea fiecărui toast -->
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['alert shadow-lg max-w-sm', alertClass[toast.type]]"
      >
        <span class="text-xl">{{ icons[toast.type] }}</span>
        <span>{{ toast.message }}</span>
        <button @click="removeToast(toast.id)" class="btn btn-ghost btn-xs btn-circle">
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
/* Animații pentru intrarea/ieșirea toast-urilor */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.4s ease;
}
</style>
