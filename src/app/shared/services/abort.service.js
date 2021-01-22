import { RouterService, Service } from 'appable';

import { HttpClientService } from './http-client.service';

/**
 * @type {AbortService}
 */
// @ts-ignore
export const AbortService = new class extends Service {

    /**
     * @param {HttpClientService} client
     * @returns {EventListenerOrEventListenerObject}
     */
    add(client) {
        const onAbort = () => client.abort();
        RouterService.attach(onAbort);
        return onAbort;
    }

    /**
     * @param {Function} onAbort
     */
    remove(onAbort) {
        RouterService.detach(onAbort);
    }

}();
