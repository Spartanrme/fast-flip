import { Settings } from "../Settings";

export class AFKOverlay extends PIXI.Container {
    public static readonly NAME: string = "afk-overlay";

    readonly #settings: Settings;
    readonly #token: Token;

    #sprite: PIXI.Sprite | null = null;

    constructor(settings: Settings, token: Token) {
        super();

        this.name = AFKOverlay.NAME;
        this.#settings = settings;
        this.#token = token;
        this.#token.addChild(this);
    }

    async draw() {
        const token = this.#token;
        const texture = await loadTexture(this.#settings.afkOverlayIconPath);

        if (!texture) {
            return;
        }

        this.renderable = true;

        if (this.#sprite) {
            this.#sprite.destroy({ children: true });
        }

        this.#sprite = new PIXI.Sprite(texture);
        this.#sprite.position = new PIXI.Point(0, 0);
        this.#sprite.anchor.set(0.5);

        const { width, height } = token.bounds;
        this.#sprite.width = width * 0.8;
        this.#sprite.height = height * 0.8;
        this.#sprite.position.set(width / 2, height / 2);

        this.addChild(this.#sprite);
    }

    hide() {
        this.renderable = false;
    }
}