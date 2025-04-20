import type { SimpleIcon } from '../types/simple-icon';
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
export declare const renderSimpleIcon: ({ aProps, bgHex, fallbackHex, icon, imgProps, minContrastRatio, size, }: {
    aProps?: Record<string, any>;
    bgHex?: string;
    fallbackHex?: string;
    icon: SimpleIcon;
    imgProps?: Record<string, any>;
    minContrastRatio?: number;
    size?: number;
}) => string;
