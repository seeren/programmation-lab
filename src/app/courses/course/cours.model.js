import { Readme } from '../shared/models/readme.model';
import { Wiki } from '../shared/models/wiki.model';

/**
 * @type {Course}
 */
export class Course {

    constructor() {

        /**
         * @type {String}
         */
        this.name = null;

        /**
         * @type {String}
         */
        this.description = null;

        /**
         * @type {String}
         */
        this.color = null;

        /**
         * @type {String}
         */
        this.updated = null;

        /**
         * @type {Readme}
         */
        this.readme = null;

        /**
         * @type {Number}
         */
        this.stargazers = null;

        /**
         * @type {Number}
         */
        this.watchers = null;

        /**
         * @type {Array<Wiki>}
         */
        this.wikiList = null;
    }

}
