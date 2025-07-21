import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// base: process.env.NODE_ENV === 'production' ? '/website/' : '/',
	plugins: [tailwindcss(), sveltekit()],
	assetsInclude: ['**/*.md'], // 忽略项目中的所有md文件，不作为js模块进行解析构建，只作为静态文件引用
	server: {
		allowedHosts: ['s4.v100.vip'],
		host: '0.0.0.0',
		port: 5173,
	  },
});
