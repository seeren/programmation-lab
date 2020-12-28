import { Service } from 'appable';

import { AbortError } from '../errors/abort.error';

/**
 * @type {HttpClientService}
 */
export class HttpClientService extends Service {

    /**
     * @constructor
     */
    constructor() {
        super();

        /**
         * @type {XMLHttpRequest}
         */
        this.xhr = null;
    }

    /**
     * @param {Function} reject
     * @returns {XMLHttpRequest}
     */
    request(reject) {
        const xhr = new XMLHttpRequest();
        xhr.onerror = (e) => reject(e);
        xhr.onabort = () => reject(new AbortError());
        return xhr;
    }

    /**
     * @returns {Boolean}
     */
    abort() {
        if (this.xhr && 1 === this.xhr.readyState) {
            this.xhr.abort();
            return true;
        }
        return false;
    }

}
