import { Component } from 'appable';

// @ts-ignore
import template from './spinner.component.html';

// @ts-ignore
import './spinner.component.scss';

/**
 * @type {SpinnerComponent}
 */
export class SpinnerComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({
            selector: 'app-spinner',
            template,
        });
    }

}
