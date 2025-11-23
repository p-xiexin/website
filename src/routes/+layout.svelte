<script lang="ts">
    import Footer from "$lib/components/Footer.svelte";
	import Header from "$lib/components/Header.svelte";
    import { onMount } from "svelte";
    import { setupI18n } from "$lib/i18n";
	import "../app.css";

	let { children } = $props();

    const setSideSpacingVars = () => {
        const content = document.querySelector('.max-w-7xl') as HTMLElement;
        const sideSpace = (window.innerWidth - content.offsetWidth) / 2;
        document.documentElement.style.setProperty('--side-space', `${sideSpace}px`);
    };

    onMount(() => {
        setupI18n();
        setSideSpacingVars();
        window.addEventListener('resize', setSideSpacingVars);

        return () => window.removeEventListener('resize', setSideSpacingVars);
    });
</script>

<svelte:body />


<div class="flex w-full">
    <!-- 背景容器 - 保持固定 -->
    <div class="fixed inset-0 flex justify-center sm:px-8 pointer-events-none">
        <div class="flex w-full max-w-7xl lg:px-8">
            <div class="w-full shadow-xl dark:bg-muted"></div>
        </div>
    </div>
    
    <!-- 内容容器 - 可滚动 -->
    <div class="relative w-full min-h-screen flex justify-center sm:px-8">
        <div class="flex w-full max-w-7xl lg:px-8">
            <div class="relative flex w-full flex-col px-4 sm:px-0">
                <Header/>
                <main class="flex-auto">{@render children()}</main>
                <Footer/>
            </div>
        </div>
    </div>
</div>

