
export class SpeechBubble extends PIXI.Container {
    #sprite: PIXI.Sprite | null = null;

    async draw(token: Token) {
        this.renderable = true;
        const texture = await loadTexture("modules/fast-flip/icons/speech-bubble.svg");
        if (this.#sprite) {
            this.#sprite.destroy({ children: true });
        }

        this.#sprite = new PIXI.Sprite(texture);
        this.#sprite.position = new PIXI.Point(token.position.x + (token.width - this.#sprite.width * 0.2), token.position.y - this.#sprite.height);

        const text = new PIXI.Text(token.name, { fontFamily: "Signika, sans-serif", align: "center" });
        text.x = this.#sprite.width / 2;
        text.y = this.#sprite.height * 0.375;
        text.anchor.set(0.5);
        this.#sprite.addChild(text);

        this.addChild(this.#sprite);
    }

    hide() {
        this.renderable = false;
    }
}
