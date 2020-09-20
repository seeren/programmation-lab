import { Component } from 'appable';

// @ts-ignore
import template from './retry.component.html';

/**
 * @type {RetryComponent}
 */
export class RetryComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-retry', template });

        /**
         * @type {Function}
         */
        this.onRetry = null;
    }

    /**
     * @event
     */
    retry() {
        if (this.onRetry) {
            this.onRetry();
        }
    }

}
