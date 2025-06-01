/* eslint-disable no-undef */
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react({
        fastRefresh: {
            exclude: ['node_modules/react-chartjs-2/**']
        }
    })],
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
        host: "0.0.0.0", // Buka akses agar bisa diakses dari jaringan lain
        port: 5173, // Port default Vite
        strictPort: true, // Pastikan Vite tidak mencari port lain
        cors: true, // Aktifkan CORS agar bisa diakses dari domain lain
        allowedHosts: ["5cfb-2001-448a-5020-1604-1dcb-2e98-6b2-9832.ngrok-free.app"],
        proxy: {
            "/api": {
                target: "http://localhost:8000", // Backend Laravel lokal
                // target: "https://572c-2001-448a-5020-1604-1dcb-2e98-6b2-9832.ngrok-free.app", // Backend Laravel ngrok
                changeOrigin: true, // Pastikan origin sesuai dengan target
                // secure: false, // Nonaktifkan SSL verification jika perlu
            },
        },
    }
})
