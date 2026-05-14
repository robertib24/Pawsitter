/** @type {import('tailwindcss').Config} */
// Configurarea Tailwind CSS și DaisyUI
// Tailwind oferă clase utilitare, iar DaisyUI adaugă componente pre-stilizate (buton, card, modal etc.)
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Animații personalizate pentru elementele de interfață
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      fontFamily: {
        // Folosim Poppins pentru un aspect modern și prietenos
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  // Configurăm DaisyUI cu o temă personalizată "pawsitter"
  // Culori care evocă încredere și prietenie cu animalele
  daisyui: {
    themes: [
      {
        pawsitter: {
          "primary": "#f97316",        // portocaliu cald — culoarea principală a brandului
          "primary-content": "#ffffff",
          "secondary": "#0ea5e9",      // albastru pentru contrast
          "accent": "#10b981",         // verde pentru acțiuni pozitive
          "neutral": "#1f2937",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          "info": "#3b82f6",
          "success": "#22c55e",
          "warning": "#facc15",
          "error": "#ef4444",
        },
      },
      "dark", // temă întunecată ca alternativă
    ],
  },
}
