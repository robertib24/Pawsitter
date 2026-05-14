// Punctul de intrare al aplicației Vue
// Aici inițializăm Vue, Pinia (state management), Vue Router și directivele personalizate

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { focusDirective } from './directives/v-focus.js'
import { tooltipDirective } from './directives/v-tooltip.js'
import { permissionDirective } from './directives/v-permission.js'
import './assets/main.css'

// Creăm instanța aplicației Vue
const app = createApp(App)

// Înregistrăm Pinia — soluția modernă pentru state management în Vue 3
app.use(createPinia())

// Înregistrăm router-ul pentru navigarea SPA (single page application)
app.use(router)

// Înregistrăm directivele personalizate la nivel global
// Sintaxa: v-focus, v-tooltip, v-permission pot fi acum folosite în orice componentă
app.directive('focus', focusDirective)
app.directive('tooltip', tooltipDirective)
app.directive('permission', permissionDirective)

// Montăm aplicația în div-ul cu id="app" din index.html
app.mount('#app')
