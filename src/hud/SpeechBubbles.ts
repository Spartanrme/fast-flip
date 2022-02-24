export class SpeechBubbles {
    readonly #template: string;

    constructor() {
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
        const div = $(`<div class="chat-bubble" style="visibility:hidden; font-size: 3em">${message}</div>`);
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
        html.css("font-size", "3em")
        const position = {
            height: dimensions.height,
            width: dimensions.width,
            top: token.y - dimensions.height - 8,
            left: token.x - (dimensions.width - token.w),
        };

        html.css(position);
    }
}