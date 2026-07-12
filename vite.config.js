import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: '/sanysidroarchive/' matches the pattern from the andres-portfolio
// project — this is the repo name, and GitHub Pages serves project sites
// from https://<username>.github.io/<repo-name>/, so Vite needs to know
// that subpath ahead of time or asset links will 404 once deployed.
export default defineConfig({
  plugins: [react()],
  base: '/sanysidroarchive/',
})