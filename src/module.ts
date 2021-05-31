const MODULE_NAME = "fast-flip";
const MIRROR_HORIZONTAL_HOT_KEY = `${MODULE_NAME}.mirror-horizontal-hotkey`;
const MIRROR_VERTICAL_HOT_KEY = `${MODULE_NAME}.mirror-vertical-hotkey`;

const enum TileMirror {
    HORIZONTAL = "tileMirrorHorizontal",
    VERTICAL = "tileMirrorVertical"
}

interface TileFlags {
    [TileMirror.VERTICAL]?: boolean;
    [TileMirror.HORIZONTAL]?: boolean;
}

Hooks.once("ready", () => {
    if (!game.modules.get("lib-df-hotkeys")?.active) {
        if (game.user?.isGM) {
            ui.notifications?.error("'Fast Flip!' requires the 'Library: DF Hotkeys' module. Please install and activate this dependency.");
        }

        return;
    }

    Hotkeys.registerGroup({
        name: MODULE_NAME,
        label: "Fast Flip!"
    });

    Hotkeys.registerShortcut(
        {
            name: MIRROR_HORIZONTAL_HOT_KEY,
            label: MIRROR_HORIZONTAL_HOT_KEY,
            group: MODULE_NAME,
            default: () => { return { key: Hotkeys.keys.KeyF, alt: false, ctrl: false, shift: false }; },
            onKeyDown: handleHorizontalMirror,
        }
    );

    Hotkeys.registerShortcut(
        {
            name: MIRROR_VERTICAL_HOT_KEY,
            label: MIRROR_VERTICAL_HOT_KEY,
            group: MODULE_NAME,
            default: () => { return { key: Hotkeys.keys.KeyF, alt: false, ctrl: false, shift: true }; },
            onKeyDown: handleVerticalMirror,
        }
    )
});

Hooks.on("updateTile", (_: unknown, update: Tile.Data) => {
    // @ts-ignore
    if (game.canvas != null && game.canvas.ready) {
        // @ts-ignore
        const tile: Tile = game.canvas.background.get(update._id) ?? game.canvas.foreground.get(update._id);

        updateTileOrientation(tile);
    }
});

Hooks.on("canvasReady", () => {
    // @ts-ignore
    if (game.canvas !== null && game.canvas.ready) {
        // @ts-ignore
        const tiles = [...game.canvas.background.tiles, ...game.canvas.foreground.tiles];
        console.log(tiles);
        for (const tile of tiles) {
            updateTileOrientation(tile);
        }
    }
});

async function handleHorizontalMirror() {
    // @ts-ignore
    if (game.canvas !== null && game.canvas.ready) {
        // @ts-ignore
        const controlledTokens = game.canvas?.tokens.controlled ?? [];
        for (const token of controlledTokens) {
            await token.document.update({ "mirrorX": !token.data.mirrorX });
        }

        const controlledTiles = [
            // @ts-ignore
            ...game.canvas?.background.controlled as Tile[] ?? [],
            // @ts-ignore
            ...game.canvas?.foreground.controlled as Tile[] ?? []
        ];
        for (const tile of controlledTiles) {
            // @ts-ignore
            const previousState = tile.document.getFlag(MODULE_NAME, TileMirror.HORIZONTAL) as boolean;
            // @ts-ignore
            await tile.document.setFlag(MODULE_NAME, TileMirror.HORIZONTAL, !previousState);
        }
    }
}

async function handleVerticalMirror() {
    // @ts-ignore
    if (game.canvas !== null && game.canvas.ready) {
        // @ts-ignore
        const controlledTokens = game.canvas?.tokens.controlled ?? [];
        for (const token of controlledTokens) {
            // @ts-ignore
            await token.document.update({ "mirrorY": !token.data.mirrorY });
        }

        const controlledTiles = [
            // @ts-ignore
            ...game.canvas?.background.controlled as Tile[] ?? [],
            // @ts-ignore
            ...game.canvas?.foreground.controlled as Tile[] ?? []
        ];
        for (const tile of controlledTiles) {
            // @ts-ignore
            const previousState = tile.document.getFlag(MODULE_NAME, TileMirror.VERTICAL) as boolean;
            // @ts-ignore
            await tile.document.setFlag(MODULE_NAME, TileMirror.VERTICAL, !previousState);
        }
    }
}

function updateTileOrientation(tile: Tile) {
    if (tile.texture != null) {
        // @ts-ignore
        const flipHorizontal = tile.document.getFlag(MODULE_NAME, TileMirror.HORIZONTAL) as boolean | undefined;
        // @ts-ignore
        const flipVerical = tile.document.getFlag(MODULE_NAME, TileMirror.VERTICAL) as boolean | undefined;

        const mirrorHorizontal = flipHorizontal ? PIXI.groupD8.MIRROR_HORIZONTAL : 0;
        const mirrorVertical = flipVerical ? PIXI.groupD8.MIRROR_VERTICAL : 0;
        const rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);

        tile.texture.rotate = rotate;
        tile.refresh();
    }
}
