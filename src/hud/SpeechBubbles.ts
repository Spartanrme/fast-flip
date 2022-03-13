import { LOCALIZATION, MODULE_NAME } from "../constants";
import { Settings } from "../Settings";

export class SpeechBubbles {
    readonly #template: string;
    readonly #settings: Settings;
    readonly #keyboard: KeyboardManager;
    readonly #keybindings: ClientKeybindings;
    #keyClearInterval: number | undefined;

    constructor(settings: Settings, keyboard: KeyboardManager, keybindings: ClientKeybindings) {
        this.#settings = settings;
        this.#keyboard = keyboard;
        this.#keybindings = keybindings;
        this.#template = "templates/hud/chat-bubble.html";
    }

    get container() {
        return $("#chat-bubbles");
    }

    async show(token: Token) {
        const html = $(await this.#renderHTML({ token, message: token.name }));
        const dimensions = this.#getMessageDimensions(token.name);

        this.#setPosition(token, html, dimensions);
        this.container.append(html);


        if (!this.#keyClearInterval) {
            clearInterval(this.#keyClearInterval);
        }

        this.#keyClearInterval = setInterval(() => {
            const [bindings] = this.#keybindings.bindings?.get(`${MODULE_NAME}.${LOCALIZATION.SHOW_SPEECH_BUBBLE_HOTKEY}`) ?? [];
            const keys = bindings ? [bindings.key, ...bindings.modifiers ?? []] : [];
            const keySet = new Set(keys);
            const downKeys = normalizeKeys(this.#keyboard.downKeys);
            console.log(keySet);
            console.log(downKeys);

            if (!keySet.isSubset(downKeys)) {
                this.hide(token);
            }

        }, 250) as unknown as number;

        return await new Promise<void>(resolve =>
            html.fadeIn(250, () => {
                resolve()
            })
        );
    }

    hide(token: Token) {
        const existing = $(`.chat-bubble[data-token-id="${token.id}"]`);
        if (!existing.length) {
            return;
        }

        return new Promise<void>(resolve => {
            clearInterval(this.#keyClearInterval);

            existing.fadeOut(100, () => {
                existing.remove();
                resolve();
            });
        })
    }

    async #renderHTML(data: { token: Token, message: string }) {
        return renderTemplate(this.#template, data);
    }

    #getMessageDimensions(message: string) {
        const div = $(`<div class="chat-bubble" style="visibility:hidden; font-size: ${this.#settings.speechBubbleFontSize}px">${message}</div>`);
        $('body').append(div);
        const dims = {
            width: div[0].clientWidth + 8,
            height: div[0].clientHeight,
            unconstrained: undefined as number | undefined,
        };

        div.css({ maxHeight: "none" });
        dims.unconstrained = div[0].clientHeight;
        div.remove();

        return dims;
    }

    #setPosition(token: Token, html: JQuery, dimensions: { width: number, height: number }) {
        html.addClass("right");
        html.css("font-size", `${this.#settings.speechBubbleFontSize}px`)
        const position = {
            height: dimensions.height,
            width: dimensions.width,
            top: token.y - dimensions.height - 8,
            left: token.x - (dimensions.width - token.w),
        };

        html.css(position);
    }
}

type AltKeys = (typeof KeyboardManager.MODIFIER_CODES.Alt)[number];
type CtrlKeys = (typeof KeyboardManager.MODIFIER_CODES.Control)[number];
type ShiftKeys = (typeof KeyboardManager.MODIFIER_CODES.Shift)[number];

function normalizeKeys(keys: Set<string>): Set<string> {
    const normalizedKeys = new Set<string>();

    for (const key of keys) {
        if (KeyboardManager.MODIFIER_CODES.Alt.indexOf(key as AltKeys) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.ALT);
        }
        else if (KeyboardManager.MODIFIER_CODES.Control.indexOf(key as CtrlKeys) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.CONTROL);
        }
        else if (KeyboardManager.MODIFIER_CODES.Shift.indexOf(key as ShiftKeys) >= 0) {
            normalizedKeys.add(KeyboardManager.MODIFIER_KEYS.SHIFT);
        }
        else {
            normalizedKeys.add(key)
        }
    }

    return normalizedKeys;
}