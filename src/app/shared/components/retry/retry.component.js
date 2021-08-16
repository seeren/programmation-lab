import { Component } from 'appable';

import template from './retry.component.html';

export class RetryComponent extends Component {

    onRetry;

    constructor() {
        super('app-retry', template);
    }

    retry() {
        if (this.onRetry) {
            this.onRetry();
        }
    }

}
