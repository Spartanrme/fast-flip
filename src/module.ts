import { LOCALIZATION, MODULE_NAME } from "./constants";
import { TokenManager, TokenMirror } from "./managers/TokenManager";
import { TileManager, TileMirror } from "./managers/TileManager";
import { Settings } from "./Settings";
import * as hud from "@mr-byte/byte-core/dist/types/ui/hud";
import { getIcon } from "helpers";

Hooks.once("init", () => {
    if (game instanceof Game) {
        new FastFlipModule(game);
    }
});

class FastFlipModule {
    #tokenHUDManager!: hud.Manager<Token>;
    #tileHUDManager!: hud.Manager<Tile>;

    readonly #tokenManager: TokenManager;
    readonly #tileManager: TileManager;
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;
        const settings = new Settings(game);
        this.#tokenManager = new TokenManager(game, settings);
        this.#tileManager = new TileManager(game);

        this.#registerKeybindings();

        Hooks.on("byte-core.init", async () => {
            if (byteCore) {
                this.#tokenHUDManager = await byteCore.tokenHUD;
                this.#tileHUDManager = await byteCore.tileHUD;

                this.#registerHUDButtons(settings);
            }
        });
    }

    #registerKeybindings() {
        const horizontalFlip: () => void = async () => {
            await this.#tokenManager.mirrorSelected(TokenMirror.HORIZONTAL);
            await this.#tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL);
        };
        this.#game.keybindings.register(MODULE_NAME, "horizontalFlip", {
            name: LOCALIZATION.MIRROR_HORIZONTAL_HOTKEY,
            hint: this.#game.i18n.localize(LOCALIZATION.MIRROR_HORIZONTAL_HINT),
            editable: [
                { key: "KeyF" },
            ],
            onDown: horizontalFlip,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
            restricted: false,
            reservedModifiers: [],
            repeat: false,
        });

        const verticalFlip: () => void = async () => {
            await this.#tokenManager.mirrorSelected(TokenMirror.VERTICAL);
            await this.#tileManager.mirrorSelectedTiles(TileMirror.VERTICAL);
        };
        this.#game.keybindings.register(MODULE_NAME, "verticalFlip", {
            name: LOCALIZATION.MIRROR_VERTICAL_HOTKEY,
            hint: this.#game.i18n.localize(LOCALIZATION.MIRROR_VERTICAL_HINT),
            editable: [
                { key: "KeyF", modifiers: ["SHIFT"] },
            ],
            onDown: verticalFlip,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
            restricted: false,
            reservedModifiers: [],
            repeat: false,
        });

        const toggleAFK: () => void = async () => await this.#tokenManager.toggleAFK();
        this.#game.keybindings.register(MODULE_NAME, LOCALIZATION.TOGGLE_AFK_HOTKEY, {
            name: LOCALIZATION.TOGGLE_AFK_HOTKEY,
            hint: this.#game.i18n.localize(LOCALIZATION.TOGGLE_AFK_HINT),
            editable: [
                { key: "KeyK", modifiers: ["SHIFT"] },
            ],
            onDown: toggleAFK,
            precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
            restricted: false,
            reservedModifiers: [],
            repeat: false,
        });
    }

    #registerHUDButtons(settings: Settings) {
        const mirrorHorizontalIcon = getIcon("mirror-horizontal");
        const mirrorVerticalIcon = getIcon("mirror-vertical");
        const toggleAFKIcon = getIcon("toggle-afk");

        this.#tokenHUDManager.registerButton(`${MODULE_NAME}.mirror-horizontal`, {
            side: "left",
            title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
            icon: mirrorHorizontalIcon,
            onClick: async () => await this.#tokenManager.mirrorSelected(TokenMirror.HORIZONTAL),
            shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
        });

        this.#tokenHUDManager.registerButton(`${MODULE_NAME}.mirror-vertical`, {
            side: "left",
            title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
            icon: mirrorVerticalIcon,
            onClick: async () => await this.#tokenManager.mirrorSelected(TokenMirror.VERTICAL),
            shouldShow: (token) => settings.showMirrorButtons && token.isOwner,
        });

        this.#tokenHUDManager.registerButton(`${MODULE_NAME}.toggle-afk`, {
            side: "right",
            title: LOCALIZATION.TOGGLE_AFK_BUTTON,
            icon: toggleAFKIcon,
            onClick: async () => await this.#tokenManager.toggleAFK(),
            shouldShow: (token) => settings.allowAFKToggle && settings.showToggleAFKButton && token.isOwner && (token.actor?.hasPlayerOwner ?? false),
        });

        this.#tileHUDManager.registerButton(`${MODULE_NAME}.mirror-horizontal`, {
            side: "left",
            title: LOCALIZATION.MIRROR_HORIZONTAL_BUTTON,
            icon: mirrorHorizontalIcon,
            onClick: async () => await this.#tileManager.mirrorSelectedTiles(TileMirror.HORIZONTAL),
        });

        this.#tileHUDManager.registerButton(`${MODULE_NAME}.mirror-vertical`, {
            side: "left",
            title: LOCALIZATION.MIRROR_VERTICAL_BUTTON,
            icon: mirrorVerticalIcon,
            onClick: async () => await this.#tileManager.mirrorSelectedTiles(TileMirror.VERTICAL),
        });
    }
}
