import { SpeechBubble } from "./SpeechBubble";

// TODO: Synchronize draw state over sockets.
export class SpeechContainer extends PIXI.Container {
    #users: Map<string, SpeechBubble> = new Map();
    #game: Game;

    constructor(game: Game) {
        super();

        this.#game = game;

        if (!this.#game.canvas?.controls) {
            return;
        }

        if (this.#game.canvas.controls.fastFlipSpeech) {
            this.#game.canvas.controls.fastFlipSpeech.destroy({ children: true });
        }

        this.#game.canvas.controls.fastFlipSpeech = this.#game.canvas.controls.addChild(this);

        for (const user of game.users ?? []) {
            this.#users.set(user.id, this.addChild(new SpeechBubble()));
        }

        this.renderable = true;
    }

    async drawSpeechBubble(userID: string, tokenID: string) {
        const token = this.#game.canvas?.tokens?.get(tokenID);
        if (token) {
            const speechBubble = this.#users.get(userID);
            await speechBubble?.draw(token);
        }
    }

    hideSpeechBubble(userID: string) {
        const speechBubble = this.#users.get(userID);
        speechBubble?.hide();
    }
}

declare global {
    interface ControlsLayer {
        fastFlipSpeech: PIXI.Container | null | undefined;
    }
}