import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` deve corrispondere al nome della repository per il deploy su GitHub Pages
// (il sito viene servito da https://<utente>.github.io/Algebra-lineare/).
export default defineConfig({
  base: '/Algebra-lineare/',
  plugins: [react()],
})
