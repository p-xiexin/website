import { SvelteComponent } from "svelte";
import type { IOptions } from '../types/options';
declare const __propDef: {
    props: {
        iconSlugs?: string[];
        theme?: "light" | "dark";
        containerProps?: Record<string, any>;
        debug?: boolean;
        options?: IOptions;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type IconCloudProps = typeof __propDef.props;
export type IconCloudEvents = typeof __propDef.events;
export type IconCloudSlots = typeof __propDef.slots;
export default class IconCloud extends SvelteComponent<IconCloudProps, IconCloudEvents, IconCloudSlots> {
}
export {};
