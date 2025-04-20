import { onMount, onDestroy } from 'svelte';
/**
 * A Svelte action that calls a callback when an element enters or exits the viewport
 * @param node The element to observe
 * @param callback The callback to call when the element enters or exits the viewport
 * @returns An object with an update method
 */
export function useInViewport(node, callback) {
    let observer = null;
    const setupObserver = () => {
        if (typeof IntersectionObserver === 'undefined') {
            // Fallback for browsers that don't support IntersectionObserver
            callback(true);
            return;
        }
        observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            callback(entry.isIntersecting);
        }, { threshold: 0.1 });
        observer.observe(node);
    };
    onMount(() => {
        setupObserver();
    });
    onDestroy(() => {
        if (observer) {
            observer.disconnect();
        }
    });
    return {
        update(newCallback) {
            callback = newCallback;
        },
        destroy() {
            if (observer) {
                observer.disconnect();
            }
        }
    };
}
