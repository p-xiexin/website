import type { SimpleIcon } from '../types/simple-icon';
/**
 * Gets the hex colors for the given slugs
 * @param slugs The slugs to get hex colors for
 * @returns An array of objects with slug, hex, and title properties
 */
export declare const getSlugHexs: (slugs: string[]) => Promise<{
    hexs: SimpleIcon[];
    cache: Record<string, SimpleIcon>;
}>;
