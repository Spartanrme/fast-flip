type KeybindingData = unknown;

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