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

Hooks.on("updateTile", (_, update: Tile.Data) => {
    if (canvas != null && canvas.ready) {
        const tile: Tile = canvas.tiles.get(update._id);

        updateTileOrientation(tile);
    }
});

Hooks.on("canvasReady", () => {
    if (canvas !== null && canvas.ready) {
        const tiles = canvas.tiles.objects.children as Tile[];
        for (const tile of tiles) {
            updateTileOrientation(tile);
        }
    }
});

async function handleHorizontalMirror() {
    if (canvas !== null && canvas.ready) {
        const controlledTokens = canvas?.tokens.controlled ?? [];
        for (const token of controlledTokens) {
            await token.update({ "mirrorX": !token.data.mirrorX });
        }

        const controlledTiles = canvas?.tiles.controlled as Tile[] ?? [];
        for (const tile of controlledTiles) {
            const previousState = tile.getFlag(MODULE_NAME, TileMirror.HORIZONTAL) as boolean;
            await tile.setFlag(MODULE_NAME, TileMirror.HORIZONTAL, !previousState);
        }
    }
}

async function handleVerticalMirror() {
    if (canvas !== null && canvas.ready) {
        const controlledTokens = canvas?.tokens.controlled ?? [];
        for (const token of controlledTokens) {
            await token.update({ "mirrorY": !token.data.mirrorY });
        }

        const controlledTiles = canvas?.tiles.controlled as Tile[] ?? [];
        for (const tile of controlledTiles) {
            const previousState = tile.getFlag(MODULE_NAME, TileMirror.VERTICAL) as boolean;
            await tile.setFlag(MODULE_NAME, TileMirror.VERTICAL, !previousState);
        }
    }
}

function updateTileOrientation(tile: Tile) {
    if (tile.texture != null) {
        const flipHorizontal = tile.getFlag(MODULE_NAME, TileMirror.HORIZONTAL) as boolean | undefined;
        const flipVerical = tile.getFlag(MODULE_NAME, TileMirror.VERTICAL) as boolean | undefined;

        const mirrorHorizontal = flipHorizontal ? PIXI.groupD8.MIRROR_HORIZONTAL : 0;
        const mirrorVertical = flipVerical ? PIXI.groupD8.MIRROR_VERTICAL : 0;
        const rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);

        tile.texture.rotate = rotate;
        tile.refresh();
    }
}
