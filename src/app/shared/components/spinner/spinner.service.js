import { Component, Service } from 'appable';

import { RetryComponent } from '../retry/retry.component';
import { SpinnerComponent } from './spinner.component';

/**
 * @type {SpinnerService}
 */
// @ts-ignore
export const SpinnerService = new class extends Service {

    /**
     *
     * @param {Component} component
     * @param {SpinnerComponent} spinner
     * @param {Function} callback
     * @returns {RetryComponent}
     */
    start(component, spinner, callback) {
        const retry = new RetryComponent();
        retry.onRetry = () => {
            component.detach(retry);
            callback();
        };
        component.attach(spinner);
        component.update();
        return retry;
    }

}();
