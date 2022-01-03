declare interface TileDocument {
    getFlag(namespace: "fast-flip", flag: "tileMirrorHorizontal" | "tileMirrorVertical"): boolean;
    setFlag(namespace: "fast-flip", flag: "tileMirrorHorizontal" | "tileMirrorVertical", value: boolean): Promise<void>;
}