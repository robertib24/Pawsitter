# 🐾 PawSitter - Platformă de Pet Sitting

Proiect demonstrativ Vue 3 + Tailwind CSS + DaisyUI

## 📋 Despre proiect

PawSitter este o platformă unde proprietarii de animale pot găsi și rezerva pet sitters de încredere. Proiectul acoperă următoarele concepte:

- **a) Vue fundamentals** — data binding, directive (v-if, v-for, v-model), reactivitate
- **b) Setup dev environment** — Vite, Tailwind CSS, DaisyUI, instalare dependențe
- **c) Custom directives** — `v-focus`, `v-tooltip`, `v-permission`
- **d) Routing cu vue-router** — rute statice, dinamice, lazy loading, navigation guards
- **e) Form validation** — validare câmpuri în timp real, indicator putere parolă
- **f) Authentication & sessions** — JWT, bcrypt, localStorage, route guards
- **g) Deployment** — instrucțiuni pentru build și deploy

## 🛠️ Tehnologii

**Frontend:**
- Vue 3 (Composition API)
- Vue Router 4
- Pinia (state management)
- Tailwind CSS + DaisyUI
- Vite (bundler)
- Axios (HTTP client)

**Backend:**
- Node.js + Express
- JWT (jsonwebtoken)
- bcryptjs (hashing parole)

## 🚀 Instalare și pornire

### 1. Instalare dependențe

```bash
npm install
```

### 2. Rulare în mod dezvoltare

Rulează simultan backend-ul Express și frontend-ul Vite:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### 3. Build pentru producție

```bash
npm run build
```

Fișierele compilate vor fi în folderul `dist/`.

### 4. Preview build

```bash
npm run preview
```

## 🔐 Conturi demo

- **Admin:** `admin@pawsitter.ro` / `admin123`
- **User:** `user@pawsitter.ro` / `user123`

## 📂 Structura proiectului

```
pawsitter/
├── server/
│   └── index.js          # Backend Express + JWT auth
├── src/
│   ├── assets/
│   │   └── main.css      # Stiluri globale + Tailwind
│   ├── components/
│   │   ├── SitterCard.vue
│   │   └── BookingModal.vue
│   ├── directives/
│   │   ├── v-focus.js
│   │   ├── v-tooltip.js
│   │   └── v-permission.js
│   ├── router/
│   │   └── index.js      # Configurare rute + guards
│   ├── stores/           # Pinia stores
│   │   ├── auth.js
│   │   ├── sitters.js
│   │   └── bookings.js
│   ├── views/            # Pagini
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Sitters.vue
│   │   ├── SitterDetail.vue
│   │   ├── Bookings.vue
│   │   ├── Profile.vue
│   │   ├── About.vue
│   │   ├── Admin.vue
│   │   └── NotFound.vue
│   ├── App.vue           # Componenta rădăcină
│   └── main.js           # Punctul de intrare
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🌐 Deployment

### Opțiunea 1: Netlify / Vercel (Frontend)

1. Build proiectul: `npm run build`
2. Folder de deploy: `dist/`
3. Pentru SPA, configurează redirect-uri pentru a servi `index.html` pentru toate rutele:

**Netlify** (`_redirects` în `public/`):
```
/*    /index.html   200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Opțiunea 2: Render / Railway (Backend)

Pentru server-ul Express:
- Setează variabila de mediu `PORT` (de obicei 3000)
- Setează `JWT_SECRET` într-un `.env`
- Comandă start: `node server/index.js`

### Opțiunea 3: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000 5173
CMD ["npm", "run", "dev"]
```

## 📚 Concepte Vue 3 demonstrate

### Reactivity
- `ref()` pentru valori primitive
- `reactive()` pentru obiecte
- `computed()` pentru valori derivate
- `watch()` pentru side effects

### Composition API
- `<script setup>` syntax modern
- `defineProps()` și `defineEmits()`
- Lifecycle hooks: `onMounted`

### Componente
- Componente reutilizabile cu props și events
- Slot-uri pentru conținut flexibil
- Componente single-file (.vue)

### Routing
- Rute statice și dinamice (`:id`)
- Lazy loading pentru optimizare
- Navigation guards (beforeEach)
- Route meta pentru autorizare

### State Management (Pinia)
- Setup Stores cu Composition API
- State, getters, actions
- Persistare în localStorage

## 📄 Licență

MIT
