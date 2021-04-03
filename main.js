const MODULE_NAME = "fast-flip";
const FLIP_TOKEN_HOT_KEY = `${MODULE_NAME}.flip-token`;

Hooks.once("ready", () => {
    if (!game.modules.get("lib-df-hotkeys")?.active) {
        if (game.user.isGM) {
            ui.notifications.error("'Fast Flip!' requires the 'Library: DF Hotkeys' module. Please install and activate this dependency.");
        }

        return;
    }

    Hotkeys.registerShortcut(
        {
            name: FLIP_TOKEN_HOT_KEY,
            label: FLIP_TOKEN_HOT_KEY,
            default: () => { return { key: Hotkeys.keys.KeyF, alt: false, ctrl: false, shift: false }; },
            onKeyDown: handleTokenFlip,
        }
    );
});

async function handleTokenFlip() {
    const controlledTokens = canvas.tokens.controlled || game.canvas.tokens.controlled;

    for (const token of controlledTokens) {
        await token.update({ "mirrorX": !token.data.mirrorX });
    }
}
