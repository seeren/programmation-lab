import { Markdown } from './markdown/markdown';

/**
 * @type {Readme}
 */
export class Readme {

    constructor() {

        /**
         * @type {String}
         */
        this.raw = null;

        /**
         * @type {Array<Markdown>}
         */
        this.content = [];
    }

}
