/**
 * Gets the SVG paths for the given slugs
 * @param slugs The slugs to get paths for
 * @returns An array of objects with slug and path properties
 */
export const getSlugsPath = async (slugs) => {
    try {
        // Import all icons from simple-icons
        const simpleIcons = await import('simple-icons');
        // Get all icon keys (excluding default export)
        const iconKeys = Object.keys(simpleIcons).filter(key => key !== 'default');
        // Create a map of slug to icon
        const iconMap = {};
        for (const key of iconKeys) {
            const icon = simpleIcons[key];
            if (icon && icon.slug) {
                iconMap[icon.slug] = icon;
            }
        }
        // Filter the map to only include the requested slugs
        return slugs
            .map(slug => {
            const icon = iconMap[slug];
            return icon ? { slug, path: icon.path } : null;
        })
            .filter(Boolean);
    }
    catch (error) {
        console.error('Error loading simple-icons:', error);
        return [];
    }
};
