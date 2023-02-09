import { SocketMessage, SocketMessageType } from "../socket/messages";
import { Settings } from "../Settings";
import { SpeechBubbles } from "../hud/SpeechBubbles";
import { MODULE_NAME } from "../constants";
import { LOCALIZATION } from "../constants";
import { normalizeKeys } from "../helpers";

export class SpeechManager {
    readonly #game: Game;
    readonly #settings: Settings;

    #keyClearInterval: number | undefined;

    #speechBubbles?: SpeechBubbles;

    constructor(game: Game, settings: Settings) {
        this.#game = game;
        this.#settings = settings;

        Hooks.on("canvasReady", this.#onCanvasReady.bind(this));
        this.#game.socket?.on(
            "module.fast-flip",
            this.#onSocketMessage.bind(this),
        );
    }

    async showSpeechBubble() {
        if (!this.#settings.allowSpeechBubbles) {
            return;
        }

        const token = this.#game.canvas?.tokens?.controlled?.[0];

        if (!token?.isOwner) {
            return;
        }

        const sceneID = this.#game.canvas.scene?.id;
        const tokenID = token?.id;

        if (tokenID && sceneID) {
            await this.#speechBubbles?.show(token);

            if (!this.#keyClearInterval) {
                clearInterval(this.#keyClearInterval);
            }

            this.#keyClearInterval = setInterval(() => {
                const [bindings] =
                    this.#game.keybindings.bindings?.get(
                        `${MODULE_NAME}.${LOCALIZATION.SHOW_SPEECH_BUBBLE_HOTKEY}`,
                    ) ?? [];
                const keys = bindings
                    ? [bindings.key, ...(bindings.modifiers ?? [])]
                    : [];
                const keySet = new Set(keys);
                const downKeys = normalizeKeys(this.#game.keyboard!.downKeys);

                if (!keySet.isSubset(downKeys)) {
                    this.hideSpeechBubble();
                }
            }, 250) as unknown as number;

            this.#game.socket?.emit("module.fast-flip", {
                type: SocketMessageType.ShowSpeechBubble,
                tokenID,
                sceneID,
            });
        }
    }

    // NOTE: Allow this no matter what, in the event the setting is changed while speech bubbles are active.
    hideSpeechBubble() {
        const sceneID = this.#game.canvas.scene?.id;
        const token = this.#game.canvas?.tokens?.controlled?.[0];

        if (!token?.isOwner) {
            return;
        }

        if (sceneID) {
            this.#speechBubbles?.hide(token);
            this.#game.socket?.emit("module.fast-flip", {
                type: SocketMessageType.HideSpeechBubble,
                sceneID,
                tokenID: token.id,
            });
        }
    }

    #onCanvasReady() {
        this.#speechBubbles = new SpeechBubbles(this.#settings);
    }

    async #onSocketMessage(data: SocketMessage) {
        if (!this.#game.canvas) {
            return;
        }

        switch (data.type) {
            case SocketMessageType.ShowSpeechBubble: {
                if (this.#game.canvas.scene?.id !== data.sceneID) {
                    return;
                }

                const token = this.#game.canvas?.tokens?.get(data.tokenID);
                if (!token) {
                    return;
                }

                await this.#speechBubbles?.show(token);

                return;
            }
            case SocketMessageType.HideSpeechBubble: {
                if (this.#game.canvas.scene?.id !== data.sceneID) {
                    return;
                }

                const token = this.#game.canvas?.tokens?.get(data.tokenID);
                if (!token) {
                    return;
                }

                this.#speechBubbles?.hide(token);
                return;
            }
        }
    }
}
