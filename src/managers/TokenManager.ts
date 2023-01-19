import { AFKOverlay } from "pixi/AFKOverlay";
import { LOCALIZATION, MODULE_NAME } from "../constants";
import { Settings } from "../Settings";

export const enum TokenMirror {
    HORIZONTAL = "scaleX",
    VERTICAL = "scaleY",
}

const AFK_STATE_KEY = "afk-state";

export class TokenManager {
    readonly #game: Game;
    readonly #settings: Settings;

    constructor(game: Game, settings: Settings) {
        this.#game = game;
        this.#settings = settings;

        Hooks.on("updateToken", this.#onUpdateToken.bind(this));
        Hooks.on("drawToken", this.#onDrawToken.bind(this));
    }

    async mirrorSelected(tokenMirrorDirection: TokenMirror) {
        for (const token of this.#controlledTokens) {
            if (!token.isOwner) {
                continue;
            }

            //@ts-ignore
            if (token._animation) {
                //@ts-ignore
                console.log(token._animation);
                continue;
            }

            const flipMirror = -((token.document as any).texture[tokenMirrorDirection]);
            const animationDuration = this.#settings.animationDuration;

            await token.document.update(
                {
                    [`texture.${tokenMirrorDirection}`]: flipMirror,
                },
                {
                    //@ts-ignore
                    animate: animationDuration !== 0,
                    //@ts-ignore
                    animation: {
                        duration: animationDuration
                    }
                }
            );
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

            await isAFK
                ? this.#unsetAFK(token)
                : this.#setAFK(token);
        }
    }

    async #setAFK(token: Token) {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, true);

        this.#settings.showAFKStatusInChat &&
            ChatMessage.create({
                type: CONST.CHAT_MESSAGE_TYPES.OOC,
                speaker: { token: token.id },
                content: this.#game.i18n.format(
                    LOCALIZATION.CHAT_AFK_MESSAGE,
                    {
                        name: token.name,
                    }
                ),
            });
    }

    async #unsetAFK(token: Token) {
        await token.document.setFlag(MODULE_NAME, AFK_STATE_KEY, false);

        this.#settings.showAFKStatusInChat &&
            ChatMessage.create({
                type: CONST.CHAT_MESSAGE_TYPES.OOC,
                speaker: { token: token.id },
                content: this.#game.i18n.format(
                    LOCALIZATION.CHAT_RETURNED_MESSAGE,
                    {
                        name: token.name,
                    }
                ),
            });

        return;
    }

    get #controlledTokens(): Token[] {
        return this.#game.canvas.tokens?.controlled ?? [];
    }

    async #onDrawToken(token: Token) {
        console.log("Drawing token");
        if (!token) {
            return;
        }

        if (!token.actor?.hasPlayerOwner) {
            return;
        }

        const overlay = (token.getChildByName(AFKOverlay.NAME, true)) as AFKOverlay | undefined;
        if (!overlay) {
            new AFKOverlay(this.#settings, token);
        }

        await this.#updateTokenAFKOverlay(token);
    }

    async #onUpdateToken(_: unknown, data: foundry.data.TokenData) {
        if (!data._id || (data.flags?.[MODULE_NAME] as Record<string, unknown>)?.[AFK_STATE_KEY] == undefined) {
            return;
        }

        const token = (this.#game.canvas.tokens as any).get(data._id);
        if (!token) {
            return;
        }

        await this.#updateTokenAFKOverlay(token);
    }

    async #updateTokenAFKOverlay(token: Token) {
        const overlay = (token.getChildByName(AFKOverlay.NAME, true)) as AFKOverlay | undefined;

        if (!overlay) {
            return;
        }

        const isAFK = token.document.getFlag(MODULE_NAME, AFK_STATE_KEY);
        if (!isAFK) {
            overlay.hide();
            return;
        }

        await overlay.draw();
    }
}
