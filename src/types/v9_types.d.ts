type KeybindingData = unknown;

type IntrinsicElement<T extends HTMLElement> = Partial<T> & { className?: string };

declare namespace JSX {
    type Element = HTMLElement | DocumentFragment;

    declare interface IntrinsicElements {
        div: IntrinsicElement<HTMLDivElement>;
        img: IntrinsicElement<HTMLImageElement>;
    }
}

declare class ClientKeybindings {
    register(namespace: string, action: string, data: KeybindingData);
}

declare interface Game {
    keybindings: ClientKeybindings
}

declare interface TileDocument {
    getFlag(namespace: "fast-flip", flag: "tileMirrorHorizontal" | "tileMirrorVertical"): boolean;
    setFlag(namespace: "fast-flip", flag: "tileMirrorHorizontal" | "tileMirrorVertical", value: boolean): Promise<void>;
}