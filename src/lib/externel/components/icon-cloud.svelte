<script lang="ts">
import { onMount } from "svelte";
import { writable, derived, type Writable, type Readable } from "svelte/store";
import Cloud from "./cloud.svelte";
import { fetchSimpleIcons } from "../utils/fetch-simple-icons";
import { renderSimpleIcon } from "../renderers/simple-icon";
import type { IOptions } from "../types/options";
import type { SimpleIcon } from "../types/simple-icon";

export let iconSlugs: string[] = [];
export let theme: 'light' | 'dark' = "light";
export let containerProps: Record<string, any> = {
  style: "display: flex; justify-content: center; align-items: center; width: 100%; padding-top: 40px;"
};
export let debug: boolean = false;
export let options: Partial<IOptions> = {
  reverse: true,
  depth: 1,
  wheelZoom: false,
  imageScale: 2,
  activeCursor: "default",
  tooltip: "native",
  initial: [0.1, -0.1],
  clickToFront: 500,
  tooltipDelay: 0,
  outlineColour: "#0000",
  maxSpeed: 0.04,
  minSpeed: 0.02,
  textColour: "#000000",
  textHeight: 25,
  textFont: "Impact,Arial Black,sans-serif",
  shadow: "#000",
  shadowBlur: 0,
  shadowOffset: [0, 0],
  stretchX: 1,
  stretchY: 1,
  shuffleTags: true,
  shape: "sphere",
  fadeIn: 800,
  weight: true
};

const loading: Writable<boolean> = writable(true);
const error: Writable<Error | null> = writable(null);
const iconData: Writable<Record<string, SimpleIcon> | null> = writable(null);
const debugInfo: Writable<string> = writable("");

onMount(async () => {
  try {
    loading.set(true);
    error.set(null);
    debugInfo.set("Fetching icons...");
    
    const data = await fetchSimpleIcons({ slugs: iconSlugs });
    
    if (Object.keys(data.simpleIcons).length === 0) {
      debugInfo.set("No icons found. Check if the slugs are correct.");
      error.set(new Error("No icons found. Check if the slugs are correct."));
    } else {
      debugInfo.set(`Found ${Object.keys(data.simpleIcons).length} icons.`);
      iconData.set(data.simpleIcons);
    }
  } catch (err) {
    console.error("Error fetching icons:", err);
    debugInfo.set(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    error.set(err instanceof Error ? err : new Error("Unknown error fetching icons"));
  } finally {
    loading.set(false);
  }
});

const renderedIcons: Readable<string> = derived(
  [iconData, writable(theme)],
  ([$iconData, $theme]) => {
    if (!$iconData) return "";
    
    try {
      const icons = Object.values($iconData)
        .map((icon) => renderCustomIcon(icon, $theme))
        .join("");
      
      debugInfo.set(`Rendered ${Object.values($iconData).length} icons.`);
      return icons;
    } catch (err) {
      console.error("Error rendering icons:", err);
      debugInfo.set(`Error rendering: ${err instanceof Error ? err.message : "Unknown error"}`);
      return "";
    }
  }
);

function renderCustomIcon(icon: SimpleIcon, currentTheme: 'light' | 'dark'): string {
  const bgHex = currentTheme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = currentTheme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = currentTheme === "dark" ? 2 : 1.2;
  
  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: "#",
      onclick: "javascript:void(0);return false;"
    }
  });
}
</script>

{#if $loading}
  <div class="loading">
    <p>Loading icons...</p>
    {#if debug}
      <p class="debug">{$debugInfo}</p>
    {/if}
  </div>
{:else if $error}
  <div class="error">
    <p>Error loading icons: {$error.message}</p>
    {#if debug}
      <p class="debug">{$debugInfo}</p>
    {/if}
  </div>
{:else}
  <Cloud {options} {containerProps}>
    {@html $renderedIcons}
  </Cloud>
  
  <!-- Debug info -->
  {#if debug}
    <div class="debug-info">
      <p>{$debugInfo}</p>
      <p>Icons in DOM: {$iconData ? Object.keys($iconData).length : 0}</p>
      <p>Theme: {theme}</p>
    </div>
  {/if}
{/if}

<style>
  .loading, .error {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 2rem;
    text-align: center;
  }
  
  .error {
    color: #e74c3c;
  }
  
  .debug {
    font-size: 0.8rem;
    color: #666;
    margin-top: 1rem;
  }
  
  .debug-info {
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5rem;
    font-size: 0.8rem;
    max-width: 100%;
    z-index: 9999;
  }
</style> 