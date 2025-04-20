// Components
export { default as Cloud } from './components/cloud.svelte';
export { default as IconCloud } from './components/icon-cloud.svelte';

// Renderers
import { renderSimpleIcon } from './renderers/simple-icon';
export { renderSimpleIcon };

// Utils
export { fetchSimpleIcons } from './utils/fetch-simple-icons';
export { getSlug } from './utils/get-slug';
export { getSlugHexs } from './utils/get-slug-hexs';
export { getSlugsPath } from './utils/get-slugs-path';
export { guid } from './utils/guid';
export { addHash } from './utils/add-hash';
export { useInViewport } from './utils/use-in-viewport';

// Types
export type { ICloud } from './types/cloud';
export type { IOptions } from './types/options';
export type { SimpleIcon } from './types/simple-icon'; 