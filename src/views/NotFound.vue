<script setup>
// Pagina 404 — afișată pentru URL-uri inexistente
// Rută catch-all configurată în router

import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center p-4">
    <div class="text-center max-w-lg animate-on-mount">
      <div class="text-9xl mb-4">🐕‍🦺</div>
      <h1 class="text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
        404
      </h1>
      <h2 class="text-3xl font-bold mb-2">Pagina s-a rătăcit!</h2>
      <p class="opacity-70 mb-8">
        Pagina căutată nu există sau a fost mutată. Hai să te ajutăm să găsești drumul înapoi acasă.
      </p>
      <div class="flex gap-2 justify-center">
        <button @click="router.back()" class="btn btn-outline">
          ← Înapoi
        </button>
        <router-link to="/" class="btn btn-primary">
          🏠 Acasă
        </router-link>
      </div>
    </div>
  </div>
</template>
