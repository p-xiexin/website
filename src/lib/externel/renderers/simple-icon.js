import { hex2contrast, hex2rgb } from '@csstools/convert-colors';
import { guid } from '../utils/guid';
import { addHash } from '../utils/add-hash';
/**
 * Used to create a tag for the Cloud component
 * @param options.aProps Attributes passed to the underlying anchor element
 * @param options.bgHex The string hex of the background the icon will be rendered on. Ex: '#fff'. Used to determine if the min contrast ratio for the icons default color will be met
 * @param options.fallbackHex The color of the icon if the minContrastRatio is not met Ex: '#000'
 * @param options.icon The simple icon object you would like to render. Ex: import icon from "simple-icons/icons/javascript";
 * @param options.imgProps Attributes passes to the underlying img element
 * @param options.minContrastRatio 0 - 21 The min contrast ratio between icon and bgHex before the fallbackHex will be used for the icon color
 * @param options.size The size in px of the icon
 * @returns HTML string that can be used as a tag inside the Cloud component
 */
export const renderSimpleIcon = ({ aProps = {}, bgHex = '#fff', fallbackHex = '#000', icon, imgProps = {}, minContrastRatio = 1, size = 42, }) => {
    const originalHex = addHash(icon.hex);
    const bgHexHash = addHash(bgHex);
    const fallbackHexHash = addHash(fallbackHex);
    const isAccessibleColor = hex2contrast(bgHexHash, originalHex) > minContrastRatio;
    const rgb = isAccessibleColor
        ? hex2rgb(originalHex)
        : hex2rgb(fallbackHexHash);
    const [r, g, b] = rgb.map((percent) => Math.round((percent / 100) * 255));
    // Create a properly encoded SVG data URI
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" style="fill: rgb(${r}, ${g}, ${b});" viewBox="0 0 24 24" height="${size}px" width="${size}px"><title>${icon.title}</title><path d="${icon.path}"/></svg>`;
    const imgSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    const a = {
        key: guid(),
        title: icon.title,
        style: 'cursor: pointer;',
        ...aProps,
    };
    const i = {
        height: size,
        width: size,
        alt: icon.title,
        src: imgSrc,
        ...imgProps,
    };
    // Convert attributes to HTML attribute strings
    const aAttrs = Object.entries(a)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    const iAttrs = Object.entries(i)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
    // Return an HTML structure with the SVG icon instead of just the title text
    return `<li><a ${aAttrs}><img ${iAttrs}></a></li>`;
};
