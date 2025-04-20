/**
 * A Svelte action that calls a callback when an element enters or exits the viewport
 * @param node The element to observe
 * @param callback The callback to call when the element enters or exits the viewport
 * @returns An object with an update method
 */
export declare function useInViewport(node: HTMLElement, callback: (isVisible: boolean) => void): {
    update(newCallback: (isVisible: boolean) => void): void;
    destroy(): void;
};
