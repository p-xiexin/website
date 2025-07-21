import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: process.env.NODE_ENV === 'production' ? '/website/' : '/',
	plugins: [tailwindcss(), sveltekit()],
	build: {
		rollupOptions: {
			// 排除 Markdown 文件不被打包处理
			external: [/static\/posts\/.*\.md$/]
		}
	},
	server: {
		allowedHosts: ['s4.v100.vip'],
		host: '0.0.0.0',
		port: 5173,
	  },
});
