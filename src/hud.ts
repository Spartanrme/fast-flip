export interface ButtonGroupProps<T extends PlaceableObject> {
    side: "left" | "right";
    buttons: ButtonProps<T>[];
}

export interface ButtonProps<T extends PlaceableObject> {
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

type Brand<T> = T extends Tile
    ? typeof Name["TileHUD"]
    : T extends Token
    ? typeof Name["TokenHUD"]
    : T extends Drawing
    ? typeof Name["DrawingHUD"]
    : never;

export class HUD<T extends PlaceableObject> {
    readonly __brand!: Brand<T>;
    readonly #game: Game;
    readonly #buttonsGroups: ButtonGroupProps<T>[];

    constructor(game: Game, name: Name) {
        this.#game = game;
        this.#buttonsGroups = [];

        Hooks.on(`render${name}`, this.#render.bind(this));
    }

    registerButtonGroup(props: ButtonGroupProps<T>) {
        this.#buttonsGroups.push(props);
    }

    #render(hud: BasePlaceableHUD, html: JQuery) {
        for (const groupProps of this.#buttonsGroups) {
            const shouldShow = groupProps.buttons.some(button => button.shouldShow?.(hud.object as T) ?? true);

            if (shouldShow) {
                const group = document.createElement("div");

                if (groupProps.buttons.length > 1) {
                    group.style.display = "flex";
                    group.style.flexDirection = "horizontal";
                    group.style.marginRight = "40px";
                    group.style.paddingRight = "2px";
                }

                for (const props of groupProps.buttons) {
                    const title = this.#game.i18n.localize(props.title);
                    const button = document.createElement("div");
                    button.classList.add("control-icon");
                    button.onclick = () => props.onClick(hud.object as T);
                    button.title = title;

                    if (groupProps.side === "left") {
                        button.style.marginRight = "8px";
                    }

                    button.style.marginTop = "8px";
                    button.style.height = "40px";

                    const img = document.createElement("img");
                    img.title = title;
                    img.alt = title;
                    img.src = props.icon;
                    img.width = 36;
                    img.height = 36;

                    button.appendChild(img);
                    group.append(button);
                }

                html.find(`div.${groupProps.side}`).append(group);
            }
        }
    }
}

