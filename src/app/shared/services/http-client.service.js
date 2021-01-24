import { Service } from 'appable';

import { AbortError } from '../errors/abort.error';

/**
 * @type {HttpClientService}
 */
export class HttpClientService extends Service {

    /**
     * @param {Function} reject
     * @returns {XMLHttpRequest}
     */
    request(reject) {
        this.aborted = false;
        this.xhr = new XMLHttpRequest();
        this.xhr.onerror = (e) => reject(e);
        this.xhr.onabort = () => reject(new AbortError());
        return this.xhr;
    }

    /**
     * @returns {void}
     */
    abort() {
        this.aborted = true;
        if (this.xhr && 0 < this.xhr.readyState) {
            this.xhr.abort();
        }
    }

}
