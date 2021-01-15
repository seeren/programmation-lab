import { Component } from 'appable';

// @ts-ignore
import template from './chapter.component.html';

/**
 * @type {ChapterComponent}
 */
export class ChapterComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'chapter', template });
    }

}
