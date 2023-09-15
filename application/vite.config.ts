import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		port: 8080,
		strictPort: true,
		proxy: {
			'/socket.io': {
				target: 'ws://backend:3000/',
				ws: true,
			},
			'/api': {
				target: 'http://backend:3000/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
		fs: {
			allow: [
				'/application/avatar-upload/'
			]
		}
	},
});
