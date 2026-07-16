import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base relativo ('./'): gli asset vengono referenziati in modo relativo alla
// pagina, così il sito funziona sotto qualsiasi sottopercorso di GitHub Pages
// (es. /Algebra-lineare/) senza dipendere dal casing esatto dell'URL. Funziona
// perché usiamo HashRouter, quindi il routing sta tutto nel frammento (#/...).
export default defineConfig({
  base: './',
  plugins: [react()],
})
