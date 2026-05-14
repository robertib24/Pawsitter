<script setup>
// Pagina "Despre noi"
// Pagină statică care prezintă platforma PawSitter

const features = [
  { icon: '🛡️', title: 'Sitters verificați', desc: 'Toți sitter-ii trec printr-un proces riguros de verificare' },
  { icon: '⭐', title: 'Recenzii reale', desc: 'Doar utilizatori reali pot lăsa recenzii' },
  { icon: '💬', title: 'Comunicare facilă', desc: 'Chat direct cu sitter-ul tău preferat' },
  { icon: '📸', title: 'Update-uri zilnice', desc: 'Poze și video cu animalul tău în timp real' },
  { icon: '💳', title: 'Plată sigură', desc: 'Tranzacții criptate și protejate' },
  { icon: '🔄', title: 'Anulare flexibilă', desc: 'Anulează gratuit cu 48h înainte' },
]
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="gradient-bg py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="text-8xl mb-4">🐾</div>
        <h1 class="text-5xl lg:text-6xl font-bold mb-4">
          Despre <span class="text-primary">PawSitter</span>
        </h1>
        <p class="text-xl opacity-80 max-w-2xl mx-auto">
          Conectăm proprietarii de animale cu pet sitters de încredere din întreaga Românie.
          O comunitate construită pe iubire, încredere și grijă pentru blănoșii noștri.
        </p>
      </div>
    </section>

    <!-- Misiune -->
    <section class="py-20 bg-base-100">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="badge badge-primary mb-4">MISIUNEA NOASTRĂ</div>
            <h2 class="text-4xl font-bold mb-4">
              Liniștea ta sufletească,<br>
              <span class="text-primary">fericirea blănosului tău</span>
            </h2>
            <p class="text-lg opacity-80 mb-4">
              Știm cât de greu e să-ți lași animalul drag în grija altcuiva. De aceea am construit
              o platformă unde fiecare sitter este verificat, evaluat și transparent.
            </p>
            <p class="text-lg opacity-80">
              Misiunea noastră e simplă: să creăm încredere între proprietari și sitters, astfel încât
              călătoriile și ziua de muncă să nu mai însemne stres pentru tine sau pentru blănosul tău.
            </p>
          </div>
          <div class="text-center">
            <div class="text-9xl">🏡🐕❤️</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold mb-4">De ce să alegi PawSitter?</h2>
          <p class="text-lg opacity-70">Caracteristicile care ne fac diferiți</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="card bg-base-100 shadow-lg card-hover"
          >
            <div class="card-body">
              <div class="text-5xl mb-2">{{ feature.icon }}</div>
              <h3 class="card-title">{{ feature.title }}</h3>
              <p class="opacity-70">{{ feature.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-primary to-secondary text-white text-center">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold mb-4">Gata să începi?</h2>
        <p class="text-xl mb-8 opacity-90">Alătură-te comunității PawSitter astăzi!</p>
        <router-link to="/register" class="btn btn-lg bg-white text-primary hover:bg-base-200 border-0">
          Creează cont gratuit
        </router-link>
      </div>
    </section>
  </div>
</template>
