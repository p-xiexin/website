import { SvelteComponent } from "svelte";
import type { IOptions } from '../types/options';
declare const __propDef: {
    props: {
        options?: IOptions;
        containerProps?: Record<string, any>;
        canvasProps?: Record<string, any>;
        id?: string | number;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
    exports?: {} | undefined;
    bindings?: string | undefined;
};
export type CloudProps = typeof __propDef.props;
export type CloudEvents = typeof __propDef.events;
export type CloudSlots = typeof __propDef.slots;
export default class Cloud extends SvelteComponent<CloudProps, CloudEvents, CloudSlots> {
}
export {};
