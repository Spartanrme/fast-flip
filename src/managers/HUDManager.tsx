import HUDButton from "../components/HUDButton";
import DOMFactory from "../DOMFactory";

export interface ButtonProps {
    side: "left" | "right";
    title: string;
    icon: string;
    onClick: () => void | Promise<void>;
    shouldShow?: () => boolean;
}

function HUDManager(event: "renderTokenHUD" | "renderTileHUD") {
    return class {
        readonly #game: Game;
        readonly #buttons: Map<string, ButtonProps>;

        constructor(game: Game) {
            this.#game = game;
            this.#buttons = new Map();

            Hooks.on(event, this.#render.bind(this));
        }

        registerButton(id: string, props: ButtonProps) {
            this.#buttons.set(id, props);
        }

        #render(_: unknown, html: JQuery) {
            for (const [_, props] of this.#buttons) {
                const shouldShow = props.shouldShow?.() ?? true;

                if (shouldShow) {
                    const title = this.#game.i18n.localize(props.title);
                    const button = <HUDButton title={title} icon={props.icon} onClick={() => props.onClick()} />;
                    html.find(`div.${props.side}`).append(button);
                }
            }
        }
    }
}

export class TokenHUDManager extends HUDManager("renderTokenHUD") { }
export class TileHUDManager extends HUDManager("renderTileHUD") { }
