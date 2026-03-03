import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No Tailwind plugin — the project uses plain vanilla CSS in index.css
export default defineConfig({
    plugins: [react()],
})
