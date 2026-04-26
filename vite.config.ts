import {defineConfig} from 'vite'
import {devtools} from '@tanstack/devtools-vite'
import {paraglideVitePlugin} from '@inlang/paraglide-js'

import {tanstackStart} from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const storageProxy = {
    '/nix-storage': {
        target: 'https://suiteonix.com',
        changeOrigin: true,
    },
}

const config = defineConfig({
    resolve: {tsconfigPaths: true},
    server: {
        proxy: storageProxy,
    },
    preview: {
        proxy: storageProxy,
    },
    plugins: [
        devtools(),
        paraglideVitePlugin({
            project: './project.inlang',
            outdir: './src/paraglide',
            strategy: ["localStorage", "baseLocale"]
// strategy: ['url', 'baseLocale'],
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
    ],
})

export default config
