// Server backend Express pentru autentificare și sesiuni JWT
// Demonstrează: REST API, hash parole cu bcrypt, JWT pentru token-uri, CORS

import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = 3000

// Cheie secretă pentru semnarea token-urilor JWT
// În producție, aceasta ar fi stocată într-un fișier .env (variabilă de mediu)
const JWT_SECRET = 'pawsitter-secret-key-change-in-production'

// Middleware-uri Express
app.use(cors()) // permite cereri din frontend (rulează pe alt port)
app.use(express.json()) // parsează body-ul JSON din cereri

// "Baza de date" în memorie — pentru demo
// În producție, ar fi PostgreSQL, MongoDB etc.
// Parolele sunt hash-uite cu bcrypt — niciodată stocate în clar
const users = [
  {
    id: 1,
    name: 'Administrator',
    email: 'admin@pawsitter.ro',
    // Hash pentru parola "admin123" — generat cu bcrypt
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  },
  {
    id: 2,
    name: 'Robert Popescu',
    email: 'user@pawsitter.ro',
    password: bcrypt.hashSync('user123', 10),
    role: 'user'
  }
]

let nextUserId = 3

// Middleware pentru verificarea token-ului JWT
// Folosit pentru a proteja rutele care necesită autentificare
function authMiddleware(req, res, next) {
  // Token-ul vine în header-ul "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token lipsă' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verificăm validitatea token-ului cu cheia secretă
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // atașăm informațiile utilizatorului la request
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid sau expirat' })
  }
}

// RUTĂ: Înregistrare cont nou
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body

  // Validări de bază
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii' })
  }

  // Verificăm dacă email-ul este deja folosit
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email-ul este deja folosit' })
  }

  // Hash parola cu bcrypt — niciodată nu stocăm parola în clar!
  // Cost factor 10 — echilibru între securitate și performanță
  const hashedPassword = await bcrypt.hash(password, 10)

  // Creăm utilizatorul
  const newUser = {
    id: nextUserId++,
    name,
    email,
    password: hashedPassword,
    role: role || 'user'
  }
  users.push(newUser)

  // Generăm token JWT cu durata de 7 zile
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Returnăm utilizatorul (fără parolă!) și token-ul
  const { password: _, ...userWithoutPassword } = newUser
  res.json({ user: userWithoutPassword, token })
})

// RUTĂ: Autentificare
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email și parolă obligatorii' })
  }

  // Căutăm utilizatorul după email
  const user = users.find(u => u.email === email)
  if (!user) {
    return res.status(401).json({ message: 'Email sau parolă incorectă' })
  }

  // Comparăm parola introdusă cu hash-ul din "baza de date"
  // bcrypt.compare este timing-safe pentru a preveni atacuri de timing
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return res.status(401).json({ message: 'Email sau parolă incorectă' })
  }

  // Generăm token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  const { password: _, ...userWithoutPassword } = user
  res.json({ user: userWithoutPassword, token })
})

// RUTĂ: Profil utilizator curent (protejată)
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id)
  if (!user) return res.status(404).json({ message: 'Utilizator inexistent' })

  const { password: _, ...userWithoutPassword } = user
  res.json({ user: userWithoutPassword })
})

// RUTĂ: Actualizare profil
app.put('/api/auth/profile', authMiddleware, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id)
  if (userIndex === -1) return res.status(404).json({ message: 'Utilizator inexistent' })

  // Permitem actualizarea doar a câmpurilor sigure
  const { name, phone, address } = req.body
  if (name) users[userIndex].name = name
  if (phone) users[userIndex].phone = phone
  if (address) users[userIndex].address = address

  const { password: _, ...userWithoutPassword } = users[userIndex]
  res.json({ user: userWithoutPassword })
})

// RUTĂ: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Pornire server
app.listen(PORT, () => {
  console.log(`🚀 Server PawSitter pornit la http://localhost:${PORT}`)
  console.log(`📚 Conturi demo:`)
  console.log(`   Admin: admin@pawsitter.ro / admin123`)
  console.log(`   User:  user@pawsitter.ro / user123`)
})
