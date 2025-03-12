/* eslint-disable no-undef */
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@services': path.resolve(__dirname, './src/services'),
        }
    },
    server: {
        hostname: "0.0.0.0",
        allowedHosts: ["d46d-36-73-179-90.ngrok-free.app"],
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                // target: 'https://dfbb-36-74-220-158.ngrok-free.app',
                changeOrigin: true,
                rewrite: (path) => path.replace('^/api/', ''),
            }
        }
    },
    optimizeDeps: {
        force: true,
    },
})
