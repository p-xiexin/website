/**
 * Gets the SVG paths for the given slugs
 * @param slugs The slugs to get paths for
 * @returns An array of objects with slug and path properties
 */
export declare const getSlugsPath: (slugs: string[]) => Promise<{
    slug: string;
    path: string;
}[]>;
