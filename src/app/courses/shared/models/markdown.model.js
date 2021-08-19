export class Markdown {

    #checked;

    #raw;

    #document;

    get checked() {
        return this.#checked;
    }

    set checked(checked) {
        this.#checked = checked;
    }

    get raw() {
        return this.#raw;
    }

    set raw(raw) {
        this.#raw = raw;
    }

    get document() {
        return this.#document;
    }

    set document(document) {
        this.#document = document;
    }

    toJSON() {
        return {
            checked: this.#checked,
            raw: this.#raw,
            document: this.#document,
        };
    }

}
