import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// base: process.env.NODE_ENV === 'production' ? '/website/' : '/',
	plugins: [tailwindcss(), sveltekit()],
	server: {
		allowedHosts: ['s4.v100.vip'],
		host: '0.0.0.0',
		port: 5173,
	  },
});
