import type { SimpleIcon } from '../types/simple-icon';
/**
 * Fetches simple icons for the given slugs
 * @param options.slugs The slugs to fetch icons for
 * @returns An object with simpleIcons and allIcon properties
 */
export declare const fetchSimpleIcons: ({ slugs }: {
    slugs: string[];
}) => Promise<{
    simpleIcons: Record<string, SimpleIcon>;
    allIcon: Record<string, SimpleIcon>;
}>;
