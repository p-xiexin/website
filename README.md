# sv

## About This Project

This project is a **Svelte-based re-implementation** inspired by two excellent open-source projects:

* **SCLS AI Camp — MP1**: [A project template designed for building personal web CVs.](https://github.com/SCLS-AI-Camp/MP1.git)
* **Corey Chiu’s personal website**: [A beautifully designed interactive portfolio built with Next.js.](https://coreychiu.com/)

Both of those projects are written using **Next.js**, while **this repository rewrites their core ideas entirely in Svelte**, taking advantage of its simpler reactivity model and smaller bundle size.

During the rewrite, I also introduced several of my own improvements and customizations, including:

* A redesigned component structure using Svelte's single-file components
* Optimized transitions and animations
* Refined layouts and typography
* Better internationalization support
* Additional content modules tailored to my own profile

This project is therefore not a direct port, but rather a **reinterpretation** of the original ideas using the Svelte ecosystem.

Everything need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm install --registry=https://registry.npmmirror.com
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
