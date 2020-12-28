import { Service } from 'appable';

/**
 * @type {LocalStorageService}
 */
// @ts-ignore
export const LocalStorageService = new class extends Service {

    /**
     * @param {String} key
     * @return {any}
     */
    get(key) {
        const item = JSON.parse(window.localStorage.getItem(key));
        if (item && item.expires > Date.now()) {
            return item.data;
        }
    }

    /**
     * @param {String} key
     * @param {any} data
     * @param {Number} ttl
     */
    set(key, data, ttl) {
        window.localStorage.setItem(key, JSON.stringify({
            data,
            expires: Date.now() + ttl * 1000,
        }));
    }

}();
