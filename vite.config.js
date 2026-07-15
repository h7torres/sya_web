import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/sya_web/' matches the actual repo name — GitHub Pages serves
// project sites from https://<username>.github.io/<repo-name>/, so Vite
// needs to know that subpath ahead of time or asset links will 404
// once deployed.
export default defineConfig({
  plugins: [react()],
  base: '/sya_web/',
})