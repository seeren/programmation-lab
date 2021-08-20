export class Favorite {

    #course;

    #chapter;

    #section;

    get course() {
        return this.#course;
    }

    set course(course) {
        this.#course = course;
    }

    get chapter() {
        return this.#chapter;
    }

    set chapter(chapter) {
        this.#chapter = chapter;
    }

    get section() {
        return this.#section;
    }

    set section(section) {
        this.#section = section;
    }

    toJSON() {
        return {
            course: this.#course,
            chapter: this.#chapter,
            section: this.#section,
        };
    }

}
