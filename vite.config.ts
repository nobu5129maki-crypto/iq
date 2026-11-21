import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // ドメイン直下でも /iq/ でも同じファイルで動く
  base: './',
  plugins: [react(), tailwindcss()],
})
