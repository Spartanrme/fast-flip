export interface ButtonProps<T extends PlaceableObject> {
    side: "left" | "right";
    title: string;
    icon: string;
    onClick: (object: T) => void | Promise<void>;
    shouldShow?: (object: T) => boolean;
}

export const enum Name {
    DrawingHUD = "DrawingHUD",
    TokenHUD = "TokenHUD",
    TileHUD = "TileHUD",
}

export class HUD<T extends PlaceableObject> {
    readonly #game: Game;
    readonly #buttons: Map<string, ButtonProps<T>>;

    constructor(game: Game, name: Name) {
        this.#game = game;
        this.#buttons = new Map();

        Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButton(id: string, props: ButtonProps<T>) {
        this.#buttons.set(id, props);
    }

    #render(hud: BasePlaceableHUD, html: JQuery) {
        for (const [_, props] of this.#buttons) {
            const shouldShow = props.shouldShow?.(hud.object as T) ?? true;

            if (shouldShow) {
                const title = this.#game.i18n.localize(props.title);
                const button = document.createElement("div");
                button.classList.add("control-icon");
                button.onclick = () => props.onClick(hud.object as T);
                button.title = title;

                const img = document.createElement("img");
                img.title = title;
                img.alt = title;
                img.src = props.icon;
                img.width = 36;
                img.height = 36;

                button.appendChild(img);

                html.find(`div.${props.side}`).append(button);
            }
        }
    }
}
