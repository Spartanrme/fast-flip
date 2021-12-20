import { LOCALIZATION, MODULE_NAME } from "./constants";
import { TokenManager, TokenMirror } from "./managers/TokenManager";
import { TileManager, TileMirror } from "./managers/TileManager";
import { TileHUDManager, TokenHUDManager } from "./managers/HUDManager";
import { Settings } from "./Settings";

Hooks.once("init", () => {
    if (game instanceof Game) {
        new FastFlipModule(game);
    }
});

class FastFlipModule {
    readonly #tokenHUDManager: TokenHUDManager;
    readonly #tileHUDManager: TileHUDManager;
    readonly #tokenManager: TokenManager;
    readonly #tileManager: TileManager;
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;
        const settings = new Settings(game);
        this.#tokenHUDManager = new TokenHUDManager(game);
        this.#tileHUDManager = new TileHUDManager(game);
        this.#tokenManager = new TokenManager(game, settings);
        this.#tileManager = new TileManager(game);

        this.#registerKeybindings();
        this.#registerHUDButtons(settings);
    }


    #registerKeybindings() {
        this.#game.keybindings.register(MODULE_NAME, "horizontalFlip", {
            name: LOCALIZATION.MIRROR_HORIZONTAL_HOTKEY,
            hint: this.#game.i18n.localize(LOCALIZATION.MIRROR_HORIZONTAL_HINT),
            editable: [
                { key: "KeyF" },
            ],
            onDown: async () => {
                await this.#tokenManager.mirrorSelected(TokenMirror.HORIZONTAL);
                await this.#tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL);
            },
            // TODO: Fix this once V9 bindings are out.
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });

        this.#game.keybindings.register(MODULE_NAME, "verticalFlip", {
            name: LOCALIZATION.MIRROR_VERTICAL_HOTKEY,
            hint: this.#game.i18n.localize(LOCALIZATION.MIRROR_VERTICAL_HINT),
            editable: [
                { key: "KeyF", modifiers: ["SHIFT"] },
            ],
            onDown: async () => {
                await this.#tokenManager.mirrorSelected(TokenMirror.VERTICAL);
                await this.#tileManager.mirrorSelectedTiles(TileMirror.VERTICAL);
            },
            // TODO: Fix this once V9 bindings are out.
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });

        this.#game.keybindings.register(MODULE_NAME, LOCALIZATION.TOGGLE_AFK_HOTKEY, {
            name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
            hint: this.#game.i18n.localize(LOCALIZATION.TOGGLE_AFK_HINT),
            editable: [
                { key: "KeyK", modifiers: ["SHIFT"] },
            ],
            onDown: async () => await this.#tokenManager.toggleAFK(),
            // TODO: Fix this once V9 bindings are out.
            precedence: (CONST as any).KEYBINDING_PRECEDENCE.NORMAL,
            restrictied: false,
            reservedModifiers: [],
            repeat: false,
        });
    }

    #registerHUDButtons(settings: Settings) {
        this.#tokenHUDManager.registerButton(`${MODULE_NAME}.mirror-horizontal`, {
            side: "left",
            title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
            icon: "mirror-horizontal",
            onClick: async () => await this.#tokenManager.mirrorSelected(TokenMirror.HORIZONTAL),
            shouldShow: () => settings.showMirrorButtons,
        });

        this.#tokenHUDManager.registerButton(`${MODULE_NAME}.mirror-vertical`, {
            side: "left",
            title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
            icon: "mirror-vertical",
            onClick: async () => await this.#tokenManager.mirrorSelected(TokenMirror.VERTICAL),
            shouldShow: () => settings.showMirrorButtons,
        });

        this.#tokenHUDManager.registerButton(`${MODULE_NAME}.toggle-afk`, {
            side: "right",
            title: LOCALIZATION.TOGGLE_AFK_BUTTON,
            icon: "toggle-afk",
            onClick: async () => await this.#tokenManager.toggleAFK(),
            shouldShow: () => settings.showToggleAFKButton,
        });

        this.#tileHUDManager.registerButton(`${MODULE_NAME}.mirror-horizontal`, {
            side: "left",
            title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
            icon: "mirror-horizontal",
            onClick: async () => await this.#tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL),
        });

        this.#tileHUDManager.registerButton(`${MODULE_NAME}.mirror-vertical`, {
            side: "left",
            title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
            icon: "mirror-vertical",
            onClick: async () => await this.#tileManager.mirrorSelectedTiles(TileMirror.VERTICAL),
        });
    }
}
