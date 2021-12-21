export default class DOMFactory {
    static createElement<K extends keyof HTMLElementTagNameMap, P extends {}>(
        component: K | ((props: P | null) => HTMLElementTagNameMap[K]),
        props: P | null,
        ...children: Node[]
    ): HTMLElementTagNameMap[K] {
        return typeof component === "function"
            ? this.#createFunctionalComponent(component, props, children)
            : this.#createElementComponent<K, P>(component, props, children);
    }

    static #createFunctionalComponent<K extends keyof HTMLElementTagNameMap, P extends {}>(
        component: (props: P | null) => HTMLElementTagNameMap[K],
        props: P | null,
        children: Node[]
    ): HTMLElementTagNameMap[K] {
        const element = component(props);

        for (const child of children) {
            this.#appendChild(element, child);
        }

        return element;
    }

    static #createElementComponent<K extends keyof HTMLElementTagNameMap, P extends {}>(component: K, props: P | null, children: Node[]) {
        const element = document.createElement(component);

        if (props) {
            for (const key of Object.keys(props)) {
                const attributeValue = (props as any)[key];

                switch (typeof attributeValue) {
                    case "string":
                        element.setAttribute(key === "className" ? "class" : key, attributeValue);
                        break;

                    case "function":
                        const eventName = key.slice(2);
                        element.addEventListener(eventName, attributeValue);
                        break;

                    case "boolean":
                        if (attributeValue) {
                            element.setAttribute(key, "");
                        }
                        break;

                    default:
                        element.setAttribute(key, String(attributeValue));
                        break;
                }
            }
        }

        for (const child of children) {
            this.#appendChild(element, child);
        }

        return element;
    }

    static #appendChild(parent: Node, child: Node | Node[]) {
        if (!child) {
            return;
        }

        if (Array.isArray(child)) {
            for (const inner of child) {
                this.#appendChild(parent, inner);
            }

            return;
        }

        if (child instanceof Node) {
            parent.appendChild(child);
            return;
        }

        if (typeof child === "string") {
            parent.appendChild(document.createTextNode(child));
            return;
        }

        if (typeof child === "boolean") {
            return;
        }

        parent.appendChild(document.createTextNode(String(child)));
    }
}
