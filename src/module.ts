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

Hooks.once("init", () => {
    if (game instanceof Game) {
        (game as any).keybindings.register(MODULE_NAME, "horizontalFlip", {
            name: MIRROR_HORIZONTAL_HOT_KEY,
            hint: "Horizontally mirrors the selected tile or token",
            editable: [
                { key: "F" },
            ],
            onDown: handleHorizontalMirror,
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });

        (game as any).keybindings.register(MODULE_NAME, "verticalFlip", {
            name: MIRROR_VERTICAL_HOT_KEY,
            hint: "Vertically mirrors the selected tile or token",
            editable: [
                { key: "F", modifiers: ["Shift"] },
            ],
            onDown: handleVerticalMirror,
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });
    }

});

Hooks.on("updateTile", (_: unknown, update: foundry.data.TileData) => {
    if (game instanceof Game && game.canvas?.ready && update._id) {
        const tile = game.canvas.background?.get(update._id)
            ?? game.canvas.foreground?.get(update._id);

        if (tile) {
            updateTileOrientation(tile);
        }
    }
});

Hooks.on("canvasReady", () => {
    if (game instanceof Game && game.canvas?.ready) {
        const tiles = [
            ...game.canvas.background?.tiles ?? [],
            ...game.canvas.foreground?.tiles ?? []
        ];

        for (const tile of tiles) {
            updateTileOrientation(tile);
        }
    }
});

async function handleHorizontalMirror() {
    if (game instanceof Game && game.canvas?.ready) {
        const controlledTokens = game.canvas.tokens?.controlled ?? [];
        for (const token of controlledTokens) {
            await token.document.update({ "mirrorX": !token.data.mirrorX });
        }

        const controlledTiles = [
            ...game.canvas.background?.controlled ?? [],
            ...game.canvas.foreground?.controlled ?? []
        ];
        for (const tile of controlledTiles) {
            const previousState = tile.document.getFlag(MODULE_NAME, TileMirror.HORIZONTAL);
            await tile.document.setFlag(MODULE_NAME, TileMirror.HORIZONTAL, !previousState);
        }
    }
}

async function handleVerticalMirror() {
    if (game instanceof Game && game.canvas?.ready) {
        const controlledTokens = game.canvas.tokens?.controlled ?? [];
        for (const token of controlledTokens) {
            await token.document.update({ "mirrorY": !token.data.mirrorY });
        }

        const controlledTiles = [
            ...game.canvas.background?.controlled ?? [],
            ...game.canvas.foreground?.controlled ?? []
        ];
        for (const tile of controlledTiles) {
            const previousState = tile.document.getFlag(MODULE_NAME, TileMirror.VERTICAL);
            await tile.document.setFlag(MODULE_NAME, TileMirror.VERTICAL, !previousState);
        }
    }
}

function updateTileOrientation(tile: Tile) {
    if (tile.texture != null) {
        const flipHorizontal = tile.document.getFlag(MODULE_NAME, TileMirror.HORIZONTAL);
        const flipVerical = tile.document.getFlag(MODULE_NAME, TileMirror.VERTICAL);

        const mirrorHorizontal = flipHorizontal ? PIXI.groupD8.MIRROR_HORIZONTAL : 0;
        const mirrorVertical = flipVerical ? PIXI.groupD8.MIRROR_VERTICAL : 0;
        const rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);

        tile.texture.rotate = rotate;
        tile.refresh();
    }
}
