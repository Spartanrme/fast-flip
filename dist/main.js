"use strict";
const MODULE_NAME = "fast-flip";
const MIRROR_HORIZONTAL_HOT_KEY = `${MODULE_NAME}.mirror-horizontal-hotkey`;
const MIRROR_VERTICAL_HOT_KEY = `${MODULE_NAME}.mirror-vertical-hotkey`;
Hooks.once("ready", () => {
    var _a, _b, _c;
    if (!((_a = game.modules.get("lib-df-hotkeys")) === null || _a === void 0 ? void 0 : _a.active)) {
        if ((_b = game.user) === null || _b === void 0 ? void 0 : _b.isGM) {
            (_c = ui.notifications) === null || _c === void 0 ? void 0 : _c.error("'Fast Flip!' requires the 'Library: DF Hotkeys' module. Please install and activate this dependency.");
        }
        return;
    }
    Hotkeys.registerGroup({
        name: MODULE_NAME,
        label: "Fast Flip!"
    });
    Hotkeys.registerShortcut({
        name: MIRROR_HORIZONTAL_HOT_KEY,
        label: MIRROR_HORIZONTAL_HOT_KEY,
        group: MODULE_NAME,
        default: () => { return { key: Hotkeys.keys.KeyF, alt: false, ctrl: false, shift: false }; },
        onKeyDown: handleHorizontalMirror,
    });
    Hotkeys.registerShortcut({
        name: MIRROR_VERTICAL_HOT_KEY,
        label: MIRROR_VERTICAL_HOT_KEY,
        group: MODULE_NAME,
        default: () => { return { key: Hotkeys.keys.KeyF, alt: false, ctrl: false, shift: true }; },
        onKeyDown: handleVerticalMirror,
    });
});
Hooks.on("updateTile", (_, update) => {
    if (canvas != null && canvas.ready) {
        const tile = canvas.tiles.get(update._id);
        updateTileOrientation(tile);
    }
});
Hooks.on("canvasReady", () => {
    if (canvas !== null && canvas.ready) {
        const tiles = canvas.tiles.objects.children;
        for (const tile of tiles) {
            updateTileOrientation(tile);
        }
    }
});
async function handleHorizontalMirror() {
    var _a, _b;
    if (canvas !== null && canvas.ready) {
        const controlledTokens = (_a = canvas === null || canvas === void 0 ? void 0 : canvas.tokens.controlled) !== null && _a !== void 0 ? _a : [];
        for (const token of controlledTokens) {
            await token.update({ "mirrorX": !token.data.mirrorX });
        }
        const controlledTiles = (_b = canvas === null || canvas === void 0 ? void 0 : canvas.tiles.controlled) !== null && _b !== void 0 ? _b : [];
        for (const tile of controlledTiles) {
            const previousState = tile.getFlag(MODULE_NAME, "tileMirrorHorizontal" /* HORIZONTAL */);
            await tile.setFlag(MODULE_NAME, "tileMirrorHorizontal" /* HORIZONTAL */, !previousState);
        }
    }
}
async function handleVerticalMirror() {
    var _a, _b;
    if (canvas !== null && canvas.ready) {
        const controlledTokens = (_a = canvas === null || canvas === void 0 ? void 0 : canvas.tokens.controlled) !== null && _a !== void 0 ? _a : [];
        for (const token of controlledTokens) {
            await token.update({ "mirrorY": !token.data.mirrorY });
        }
        const controlledTiles = (_b = canvas === null || canvas === void 0 ? void 0 : canvas.tiles.controlled) !== null && _b !== void 0 ? _b : [];
        for (const tile of controlledTiles) {
            const previousState = tile.getFlag(MODULE_NAME, "tileMirrorVertical" /* VERTICAL */);
            await tile.setFlag(MODULE_NAME, "tileMirrorVertical" /* VERTICAL */, !previousState);
        }
    }
}
function updateTileOrientation(tile) {
    if (tile.texture != null) {
        const flipHorizontal = tile.getFlag(MODULE_NAME, "tileMirrorHorizontal" /* HORIZONTAL */);
        const flipVerical = tile.getFlag(MODULE_NAME, "tileMirrorVertical" /* VERTICAL */);
        const mirrorHorizontal = flipHorizontal ? PIXI.groupD8.MIRROR_HORIZONTAL : 0;
        const mirrorVertical = flipVerical ? PIXI.groupD8.MIRROR_VERTICAL : 0;
        const rotate = PIXI.groupD8.add(mirrorHorizontal, mirrorVertical);
        tile.texture.rotate = rotate;
        tile.refresh();
    }
}
