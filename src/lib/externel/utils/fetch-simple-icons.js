import { getSlugsPath } from './get-slugs-path';
import { getSlugHexs } from './get-slug-hexs';
/**
 * Fetches simple icons for the given slugs
 * @param options.slugs The slugs to fetch icons for
 * @returns An object with simpleIcons and allIcon properties
 */
export const fetchSimpleIcons = async ({ slugs }) => {
    const [paths, { hexs, cache }] = await Promise.all([
        getSlugsPath(slugs),
        getSlugHexs(slugs),
    ]);
    const map = {};
    // Add hex, title, and slug from hexs
    hexs.forEach((hex) => {
        map[hex.slug] = hex;
    });
    // Add path from paths
    paths.forEach((path) => {
        if (map[path.slug]) {
            map[path.slug].path = path.path;
        }
    });
    // Filter out incomplete icons
    slugs.forEach((s) => {
        const o = map[s];
        if (!o?.hex || !o?.path) {
            if (typeof window !== 'undefined') {
                console.error(`'svelte-icon-cloud/fetchSimpleIcons': the response of ${o?.slug || s} was malformed and it will be ignored.`);
            }
            delete map[s];
        }
    });
    return {
        simpleIcons: map,
        allIcon: cache,
    };
};
