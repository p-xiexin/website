let cache = null;
/**
 * Gets the hex colors for the given slugs
 * @param slugs The slugs to get hex colors for
 * @returns An array of objects with slug, hex, and title properties
 */
export const getSlugHexs = async (slugs) => {
    if (!cache) {
        try {
            // Import all icons from simple-icons
            const simpleIcons = await import('simple-icons');
            // Create a cache of all icons
            cache = {};
            // Get all icon keys (excluding default export)
            const iconKeys = Object.keys(simpleIcons).filter(key => key !== 'default');
            // Populate the cache
            for (const key of iconKeys) {
                const icon = simpleIcons[key];
                if (icon && icon.slug && icon.hex && icon.title) {
                    cache[icon.slug] = {
                        slug: icon.slug,
                        hex: icon.hex,
                        title: icon.title,
                        path: icon.path
                    };
                }
            }
        }
        catch (error) {
            console.error('Error loading simple-icons:', error);
            return { hexs: [], cache: {} };
        }
    }
    // Filter the cache to only include the requested slugs
    const hexs = slugs
        .map(slug => cache?.[slug])
        .filter(Boolean);
    return { hexs, cache };
};
