export class Course {

    #name;

    #description;

    #color;

    #updated;

    #readme

    #stargazers;

    #watchers;

    #wikiList;

    get name() {
        return this.#name;
    }

    set name(name) {
        this.#name = name;
    }

    get description() {
        return this.#description;
    }

    set description(description) {
        this.#description = description;
    }

    get color() {
        return this.#color;
    }

    set color(color) {
        this.#color = color;
    }

    get updated() {
        return this.#updated;
    }

    set updated(updated) {
        this.#updated = updated;
    }

    get readme() {
        return this.#readme;
    }

    set readme(readme) {
        this.#readme = readme;
    }

    get stargazers() {
        return this.#stargazers;
    }

    set stargazers(stargazers) {
        this.#stargazers = stargazers;
    }

    get watchers() {
        return this.#watchers;
    }

    set watchers(watchers) {
        this.#watchers = watchers;
    }

    get wikiList() {
        return this.#wikiList;
    }

    set wikiList(wikiList) {
        this.#wikiList = wikiList;
    }

}
