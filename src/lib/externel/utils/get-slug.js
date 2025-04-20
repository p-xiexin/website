/**
 * Converts a string to a slug that can be used to lookup a simple icon
 * @param s The string to convert to a slug
 * @returns The slug
 * @example
 * getSlug('Next.js') // 'nextdotjs'
 * getSlug('C++') // 'cplusplus'
 * getSlug('Microsoft SQL Server') // 'microsoftsqlserver'
 */
export const getSlug = (s) => {
    return s
        .trim()
        .toLowerCase()
        .replace(/\+/g, 'plus')
        .replace(/\./g, 'dot')
        .replace(/&/g, 'and')
        .replace(/đ/g, 'd')
        .replace(/ħ/g, 'h')
        .replace(/ı/g, 'i')
        .replace(/ĸ/g, 'k')
        .replace(/ŀ/g, 'l')
        .replace(/ł/g, 'l')
        .replace(/ß/g, 'ss')
        .replace(/ŧ/g, 't')
        .replace(/[^a-z0-9]/gi, '');
};
