import { getIcon } from "./helpers";
import { LOCALIZATION, MODULE_NAME } from "./constants";

enum SETTING {
    ANIMATION_DURATION = "animation-duration",
    ALLOW_AFK_TOGGLE = "allow-afk-toggle",
    SHOW_AFK_STATUS_IN_CHAT = "show-afk-status-in-chat",
    SHOW_MIRROR_BUTTONS_ON_HUD = "show-mirror-buttons-hud",
    SHOW_TOGGLE_AFK_BUTTON_ON_HUD = "show-toggle-afk-hud",
    AFK_OVERLAY_ICON_PATH = "afk-overlay-icon-path",
    ALLOW_SPEECH_BUBBLES = "allow-speech-bubbles",
    SPEECH_BUBBLE_FONT_SIZE = "speech-bubble-font-size",
}

type SettingMap = {
    [K in SETTING]: ClientSettings.PartialSettingConfig<string | boolean | number>;
};

export class Settings {
    readonly #game: Game;

    constructor(game: Game) {
        this.#game = game;
        this.#registerSettings();
    }

    #registerSettings() {
        const settings: SettingMap = {
            [SETTING.ANIMATION_DURATION]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.ANIMATION_DURATION,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.ANIMATION_DURATION_HINT,
                ),
                scope: "world" as const,
                config: true,
                default: 0.1,
                type: Number,
                range: {
                    min: 0,
                    max: 1.0,
                    step: 0.1
                }
            },
            [SETTING.ALLOW_SPEECH_BUBBLES]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.ALLOW_SPEECH_BUBBLES,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.ALLOW_SPEECH_BUBBLES_HINT,
                ),
                scope: "world" as const,
                config: true,
                default: true,
                type: Boolean,
            },
            [SETTING.SPEECH_BUBBLE_FONT_SIZE]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.SPEECH_BUBBLE_FONT_SIZE,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.SPEECH_BUBBLE_FONT_SIZE_HINT,
                ),
                scope: "client" as const,
                config: true,
                default: 14,
                type: Number,
                range: {
                    min: 14,
                    max: 42,
                    step: 1,
                }
            },
            [SETTING.AFK_OVERLAY_ICON_PATH]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.AFK_OVERLAY_ICON_PATH,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.AFK_OVERLAY_ICON_PATH_HINT,
                ),
                scope: "world" as const,
                config: true,
                default: getIcon("afk"),
                filePicker: "imagevideo",
            },
            [SETTING.ALLOW_AFK_TOGGLE]: {
                name: this.#game.i18n.localize(LOCALIZATION.ALLOW_AFK_TOGGLE),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.ALLOW_AFK_TOGGLE_HINT,
                ),
                scope: "world" as const,
                config: true,
                default: true,
                type: Boolean,
            },
            [SETTING.SHOW_AFK_STATUS_IN_CHAT]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.SHOW_AFK_STATUS_IN_CHAT,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.SHOW_AFK_STATUS_IN_CHAT_HINT,
                ),
                scope: "world" as const,
                config: true,
                default: true,
                type: Boolean,
            },
            [SETTING.SHOW_MIRROR_BUTTONS_ON_HUD]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.SHOW_MIRROR_BUTTONS,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.SHOW_MIRROR_BUTTONS_HINT,
                ),
                scope: "client" as const,
                config: true,
                default: true,
                type: Boolean,
            },
            [SETTING.SHOW_TOGGLE_AFK_BUTTON_ON_HUD]: {
                name: this.#game.i18n.localize(
                    LOCALIZATION.SHOW_TOGGLE_AFK_BUTTON,
                ),
                hint: this.#game.i18n.localize(
                    LOCALIZATION.SHOW_TOGGLE_AFK_HINT,
                ),
                scope: "client" as const,
                config: true,
                default: true,
                type: Boolean,
            }
        };

        for (const [name, value] of Object.entries(settings)) {
            this.#game.settings.register(MODULE_NAME, name, value);
        }
    }

    get animationDuration(): number {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.ANIMATION_DURATION,
        ) as number * 1000;
    }

    get afkOverlayIconPath(): string {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.AFK_OVERLAY_ICON_PATH,
        ) as string;
    }

    get showMirrorButtons(): boolean {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.SHOW_MIRROR_BUTTONS_ON_HUD,
        ) as boolean;
    }

    get allowAFKToggle(): boolean {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.ALLOW_AFK_TOGGLE,
        ) as boolean;
    }

    get showAFKStatusInChat(): boolean {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.SHOW_AFK_STATUS_IN_CHAT,
        ) as boolean;
    }

    get showToggleAFKButton(): boolean {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.SHOW_TOGGLE_AFK_BUTTON_ON_HUD,
        ) as boolean;
    }

    get allowSpeechBubbles(): boolean {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.ALLOW_SPEECH_BUBBLES,
        ) as boolean;
    }

    get speechBubbleFontSize(): number {
        return this.#game.settings.get(
            MODULE_NAME,
            SETTING.SPEECH_BUBBLE_FONT_SIZE
        ) as number;
    }
}
