import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // ВНИМАНИЕ: Замените 'ombiweb-hub' на точное название вашего репозитория на GitHub!
  // Если ваш репозиторий называется username.github.io, то базовый путь нужно удалить (оставить '/')
  base: '/ombiweb-hub/',
})