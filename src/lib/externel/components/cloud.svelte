<script lang="ts">
import { onMount, onDestroy } from "svelte";
import type { IOptions } from "../types/options";
import { useInViewport } from "../utils/use-in-viewport";
import { guid } from "../utils/guid";

export let options: Partial<IOptions> = {};
export let containerProps: Record<string, any> = {};
export let canvasProps: Record<string, any> = {};
export let id: string = guid();
export let debug: boolean = false;

let canvasContainerId = `canvas-container-${id}`;
let canvasId = `canvas-${id}`;
let tagsId = `tags-${id}`;
let hasStarted = false;
let mounted = false;
let container: HTMLDivElement;
let debugMessage = "";

const supportsTouch = typeof window !== "undefined" 
  ? "ontouchstart" in window || navigator.maxTouchPoints > 0 
  : false;

const mergedOptions: Partial<IOptions> = {
  dragControl: supportsTouch ? true : false,
  maxSpeed: supportsTouch ? 0.01 : 0.05,
  textFont: undefined,
  textColour: undefined,
  ...options
};

function handleVisibilityChange(isVisible: boolean): void {
  if (!window.TagCanvas) {
    debugMessage = "TagCanvas not loaded";
    console.error("TagCanvas not loaded");
    return;
  }

  try {
    if (isVisible && mounted) {
      if (hasStarted) {
        window.TagCanvas.Resume(canvasId);
        debugMessage = "TagCanvas resumed";
      } else {
        const tagsElement = document.getElementById(tagsId);
        if (tagsElement && tagsElement.children.length > 0) {
          window.TagCanvas.Start(canvasId, tagsId, mergedOptions);
          hasStarted = true;
          debugMessage = "TagCanvas started";
        } else {
          debugMessage = "Tags container is empty or not found";
          console.error("Tags container is empty or not found");
        }
      }
    } else {
      if (hasStarted) {
        window.TagCanvas.Pause(canvasId);
        debugMessage = "TagCanvas paused";
      }
    }
  } catch (e) {
    debugMessage = `Error with TagCanvas: ${e instanceof Error ? e.message : "Unknown error"}`;
    console.error("Error with TagCanvas:", e);
    if (container) {
      container.style.display = "none";
    }
  }
}

onMount(() => {
  mounted = true;
  debugMessage = "Component mounted";

  if (!window.TagCanvas) {
    debugMessage = "Loading TagCanvas script...";
    const script = document.createElement("script");
    script.src = "https://www.goat1000.com/tagcanvas.min.js";
    script.async = true;
    script.onload = () => {
      debugMessage = "TagCanvas script loaded";
      if (container && window.TagCanvas) {
        setTimeout(() => {
          debugMessage = "Initializing TagCanvas after delay...";
          const observer = new IntersectionObserver(
            (entries) => {
              handleVisibilityChange(entries[0].isIntersecting);
            },
            { threshold: 0.1 }
          );
          observer.observe(container);
        }, 1000);
      }
    };
    document.head.appendChild(script);
  } else {
    debugMessage = "TagCanvas already loaded, initializing...";
    setTimeout(() => {
      debugMessage = "Initializing TagCanvas after delay...";
      handleVisibilityChange(true);
    }, 1000);
  }

  return () => {
    try {
      if (window.TagCanvas && hasStarted) {
        window.TagCanvas.Delete(canvasId);
      }
    } catch (e) {
      console.error("Error cleaning up TagCanvas:", e);
    }
  };
});

function inViewport(node: HTMLElement) {
  return useInViewport(node, handleVisibilityChange);
}
</script>

<div 
  bind:this={container}
  id={canvasContainerId} 
  use:inViewport
  {...containerProps}
>
  <canvas
    id={canvasId}
    style="width: 100%; max-width: 70vh;"
    width={1000}
    height={1000}
    {...canvasProps}
  >
  </canvas>
  
  <div style="display: none;">
    <ul id={tagsId}>
      <slot />
    </ul>
  </div>
  
  {#if debug}
    <div class="debug-info">
      <p>Canvas ID: {canvasId}</p>
      <p>Tags ID: {tagsId}</p>
      <p>Status: {debugMessage}</p>
    </div>
  {/if}
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  .debug-info {
    position: fixed;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5rem;
    font-size: 0.8rem;
    max-width: 100%;
    z-index: 9999;
  }
</style> 