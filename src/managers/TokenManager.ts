import { LOCALIZATION, MODULE_NAME } from "../constants";
import { Settings } from "../Settings";

export const enum TokenMirror {
    HORIZONTAL = "scaleX",
    VERTICAL = "scaleY",
}

const AFK_STATE_KEY = "afk-state";
const PREVIOUS_OVERLAY_STATE_FFECT_KEY = "previous-overlay-effect";

export class TokenManager {
    readonly #game: Game;
    readonly #settings: Settings;

    constructor(game: Game, settings: Settings) {
        this.#game = game;
        this.#settings = settings;

        Hooks.on("updateToken", this.#onUpdateToken.bind(this));
    }

    async mirrorSelected(tokenMirrorDirection: TokenMirror) {
        for (const token of this.#controlledTokens) {
            if (!token.isOwner) {
                continue;
            }

            const flipMirror = -((token.document as any).texture[tokenMirrorDirection]);

            await token.document.update({
                [`texture.${tokenMirrorDirection}`]: flipMirror,
            });
        }
    }

    async toggleAFK() {
        if (!this.#settings.allowAFKToggle) {
            return;
        }

        for (const token of this.#controlledTokens) {
            if (!token.isOwner || !token.actor?.hasPlayerOwner) {
                continue;
            }

            const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);
            const afkIconPath = this.#settings.afkOverlayIconPath;

            if (isAFK) {
                const previousOverlayEffect = token.document.getFlag(
                    MODULE_NAME,
                    PREVIOUS_OVERLAY_STATE_FFECT_KEY,
                ) as string | null | undefined;
                await token.document.unsetFlag(
                    MODULE_NAME,
                    PREVIOUS_OVERLAY_STATE_FFECT_KEY,
                );
                await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);
                await token.document.update({
                    overlayEffect: previousOverlayEffect ?? null,
                });

                this.#settings.showAFKStatusInChat &&
                    ChatMessage.create({
                        type: CONST.CHAT_MESSAGE_TYPES.OOC,
                        speaker: { token: token.id },
                        content: this.#game.i18n.format(
                            LOCALIZATION.CHAT_RETURNED_MESSAGE,
                            {
                                name: token.name,
                            },
                        ),
                    });
            } else {
                const previousOverlayEffect = (token.document as any).overlayEffect;
                await token.document.setFlag(
                    MODULE_NAME,
                    PREVIOUS_OVERLAY_STATE_FFECT_KEY,
                    previousOverlayEffect,
                );
                await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);
                await token.document.update({ overlayEffect: afkIconPath });

                this.#settings.showAFKStatusInChat &&
                    ChatMessage.create({
                        type: CONST.CHAT_MESSAGE_TYPES.OOC,
                        speaker: { token: token.id },
                        content: this.#game.i18n.format(
                            LOCALIZATION.CHAT_AFK_MESSAGE,
                            {
                                name: token.name,
                            },
                        ),
                    });
            }

            // await token.drawEffects();
        }
    }

    get #controlledTokens(): Token[] {
        return this.#game.canvas.tokens?.controlled ?? [];
    }

    async #onUpdateToken(_: unknown, update: foundry.data.TokenData) {
        if (update._id && update.overlayEffect !== undefined) {
            const token = (this.#game.canvas.tokens as any).get(update._id);

            if (token) {
                await token.drawEffects();
            }
        }
    }

}
