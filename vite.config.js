import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor: React core
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    // Vendor: Firebase SDK (large)
                    'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
                    // Vendor: Icons
                    'vendor-icons': ['lucide-react'],
                },
            },
        },
        // Warn if any chunk exceeds 300kb
        chunkSizeWarningLimit: 300,
    },
})
