import { getIcon } from "./helpers";
import { LOCALIZATION, MODULE_NAME } from "./constants";

namespace SETTING {
    export const SHOW_MIRROR_BUTTONS_ON_HUD = "show-mirror-buttons-hud";
    export const SHOW_TOGGLE_AFK_BUTTON_ON_HUD = "show-toggle-afk-hud";
    export const AFK_OVERLAY_ICON_PATH = "afk-overlay-icon-path";
}

export class Settings {
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;
        this.#registerSettings();
    }

    #registerSettings() {
        this.#game.settings.register(MODULE_NAME, SETTING.AFK_OVERLAY_ICON_PATH, {
            name: this.#game.i18n.localize(LOCALIZATION.AFK_OVERLAY_ICON_PATH),
            hint: this.#game.i18n.localize(LOCALIZATION.AFK_OVERLAY_ICON_PATH_HINT),
            scope: "world",
            config: true,
            default: getIcon("afk"),
            filePicker: "imagevideo",
        });

        this.#game.settings.register(MODULE_NAME, SETTING.SHOW_MIRROR_BUTTONS_ON_HUD, {
            name: this.#game.i18n.localize(LOCALIZATION.SHOW_MIRROR_BUTTONS),
            hint: this.#game.i18n.localize(LOCALIZATION.SHOW_MIRROR_BUTTONS_HINT),
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
        });

        this.#game.settings.register(MODULE_NAME, SETTING.SHOW_TOGGLE_AFK_BUTTON_ON_HUD, {
            name: this.#game.i18n.localize(LOCALIZATION.SHOW_TOGGLE_AFK_BUTTON),
            hint: this.#game.i18n.localize(LOCALIZATION.SHOW_TOGGLE_AFK_HINT),
            scope: "client",
            config: true,
            default: true,
            type: Boolean,
        });
    }

    get afkOverlayIconPath(): string {
        return this.#game.settings.get(MODULE_NAME, SETTING.AFK_OVERLAY_ICON_PATH) as string;
    }

    get showMirrorButtons(): boolean {
        return this.#game.settings.get(MODULE_NAME, SETTING.SHOW_MIRROR_BUTTONS_ON_HUD) as boolean;
    }

    get showToggleAFKButton(): boolean {
        return this.#game.settings.get(MODULE_NAME, SETTING.SHOW_TOGGLE_AFK_BUTTON_ON_HUD) as boolean;
    }
}