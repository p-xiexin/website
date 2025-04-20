/**
 * Converts a string to a slug that can be used to lookup a simple icon
 * @param s The string to convert to a slug
 * @returns The slug
 * @example
 * getSlug('Next.js') // 'nextdotjs'
 * getSlug('C++') // 'cplusplus'
 * getSlug('Microsoft SQL Server') // 'microsoftsqlserver'
 */
export declare const getSlug: (s: string) => string;
