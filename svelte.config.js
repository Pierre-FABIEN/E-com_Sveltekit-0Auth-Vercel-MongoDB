import { defineConfig } from 'vite';
import sveltePreprocess from 'svelte-preprocess';
import vercel from '@sveltejs/adapter-vercel';
import sass from 'vite-plugin-sass';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sass({ outputStyle: 'compressed' }),
		// VitePWA({
		// 	manifest: {
		// 		// les options pour votre manifeste
		// 		name: 'Mon App SvelteKit PWA',
		// 		short_name: 'SvelteKitPWA',
		// 		description: 'Une démo de PWA avec SvelteKit et Vite',
		// 		icons: [
		// 			// Vos icônes pour la PWA
		// 		]
		// 		// ... d'autres options du manifeste
		// 	},
		// 	workbox: {
		// 		// les options pour workbox
		// 		swSrc: './src/sw.js',
		// 		runtimeCaching: [
		// 			{
		// 				urlPattern: /^https?.*/,
		// 				handler: 'NetworkFirst',
		// 				options: {
		// 					cacheName: 'http-cache'
		// 				}
		// 			}
		// 		]
		// 	}
		// })
	],
	preprocess: [
		sveltePreprocess({
			scss: {
				includePaths: ['src/styles']
			},
			postcss: {
				plugins: [autoprefixer()]
			}
		})
	],
	kit: {
		adapter: vercel(),
		alias: {
			// this will match a file
			$db: 'src/db',
			$components: 'src/components',
			$modelNotifications: 'src/api/modelNotifications',
			$utils: 'src/utils',
			$stores: 'src/stores',
			$UITools: 'src/lib/UITools',
			$language: 'src/language',
			$three: 'src/lib/components/three',
			$services: 'src/services',
			$lib: "src/lib",
			$api: 'src/api',
			$routes: "src/routes"
		}
	}
});
