import { SpeechContainer } from "pixi/SpeechContainer";
import { SocketMessage, SocketMessageType } from "../socket/messages";
import { Settings } from "../Settings";

export class SpeechManager {
    readonly #game: Game;
    readonly #settings: Settings;

    #speechContainer?: SpeechContainer;

    constructor(game: Game, settings: Settings) {
        this.#game = game;
        this.#settings = settings;

        Hooks.on("canvasReady", this.#onCanvasReady.bind(this));
        this.#game.socket?.on("module.fast-flip", this.#onSocketMessage.bind(this));
    }

    async showSpeechBubble() {
        if (!this.#settings.allowSpeechBubbles) {
            return;
        }
        const token = this.#game.canvas?.tokens?.controlled?.[0];

        if (!token?.isOwner) {
            return;
        }

        const userID = this.#game.userId;
        const sceneID = this.#game.canvas.scene?.id;
        const tokenID = token?.id;

        if (tokenID && userID && sceneID) {
            await this.#speechContainer?.drawSpeechBubble(userID, tokenID);
            this.#game.socket?.emit("module.fast-flip", {
                type: SocketMessageType.ShowSpeechBubble,
                userID,
                tokenID,
                sceneID,
            });
        }
    }

    // NOTE: Allow this no matter what, in the event the setting is changed while speech bubbles are active.
    hideSpeechBubble() {
        const userID = this.#game.userId;
        const sceneID = this.#game.canvas.scene?.id;

        if (userID && sceneID) {
            this.#speechContainer?.hideSpeechBubble(userID);
            this.#game.socket?.emit("module.fast-flip", {
                type: SocketMessageType.HideSpeechBubble,
                userID,
                sceneID,
            });
        }
    }

    #onCanvasReady() {
        this.#speechContainer = new SpeechContainer(this.#game);
    }

    async #onSocketMessage(data: SocketMessage) {
        if (!this.#game.canvas) {
            return;
        }

        switch (data.type) {
            case SocketMessageType.ShowSpeechBubble:
                if (this.#game.canvas.scene?.id !== data.sceneID) {
                    return;
                }

                await this.#speechContainer?.drawSpeechBubble(data.userID, data.tokenID);
                return;

            case SocketMessageType.HideSpeechBubble:
                if (this.#game.canvas.scene?.id !== data.sceneID) {
                    return;
                }

                this.#speechContainer?.hideSpeechBubble(data.userID);
                return;
        }
    }
}

