import type { IOptions } from './options';
/**
 * Props for the Cloud component
 * @param canvasProps Attributes passed to the underlying canvas element
 * @param containerProps Attributes passed to the root div element
 * @param id Should be provided when using SSR
 * @param options https://www.goat1000.com/tagcanvas-options.php
 */
export interface ICloud {
    canvasProps?: Record<string, any>;
    containerProps?: Record<string, any>;
    id?: string | number;
    options?: IOptions;
}
