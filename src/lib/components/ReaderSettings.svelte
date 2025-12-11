<script lang="ts">
    import { slide } from "svelte/transition";

    export let fontSize: number = 18;
    export let lineHeight: number = 1.8;
    export let align: 'left' | 'right' = 'right';

    let showSettings = false;
    let container: HTMLElement;

    function handleClickOutside(event: MouseEvent) {
        if (showSettings && container && !container.contains(event.target as Node)) {
            showSettings = false;
        }
    }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative inline-block text-left" bind:this={container}>
    <button 
        on:click={() => showSettings = !showSettings}
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
        title="Appearance Settings"
        aria-label="Appearance Settings"
    >
        <span class="text-base font-serif">Aa</span>
    </button>

    {#if showSettings}
        <div 
            transition:slide={{ duration: 200, axis: 'y' }}
            class="absolute z-50 mt-2 w-72 p-4 bg-white/95 dark:bg-[#252526]/95 backdrop-blur-md border border-gray-200 dark:border-[#333333] rounded-xl shadow-2xl space-y-4 {align === 'right' ? 'right-0' : 'left-0'}"
        >
            <!-- Font Size Control -->
            <div class="space-y-2">
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                    <span>Font Size</span>
                    <span>{fontSize}px</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <span class="text-xs">A</span>
                    <input 
                        type="range" 
                        min="14" 
                        max="24" 
                        step="1" 
                        bind:value={fontSize}
                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    >
                    <span class="text-lg">A</span>
                </div>
            </div>

            <!-- Line Height Control -->
            <div class="space-y-2 border-t border-gray-100 dark:border-[#333333] pt-3">
                <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                    <span>Line Height</span>
                    <span>{lineHeight}</span>
                </div>
                <div class="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                    <input 
                        type="range" 
                        min="1.4" 
                        max="2.2" 
                        step="0.1" 
                        bind:value={lineHeight}
                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                    >
                    <svg class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </div>
            </div>
        </div>
    {/if}
</div>