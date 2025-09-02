import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/carapi": {
                target: "https://carapi.app/api",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/carapi/, ""),
            },
        },
    },
});