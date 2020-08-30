import { Component } from 'appable';

// @ts-ignore
import template from './main.component.html';

/**
 * @type {MainComponent}
 */
export class MainComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-main', template });
    }

}
