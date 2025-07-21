// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: ['.md'],
  exclude: [/static\/posts\/.*\.md/]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // ✅ SPA fallback，所有路径走 index.html
      precompress: false,
      strict: false // ✅ 忽略动态路径报错
    }),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/website' : ''
    },
    prerender: {
      entries: [] // 不强制预渲染任何页面
    }
  }
};

export default config;
