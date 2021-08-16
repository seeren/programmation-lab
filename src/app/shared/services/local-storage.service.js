import { Service } from 'appable';

export const LocalStorageService = new class extends Service {

    get(key) {
        const item = JSON.parse(window.localStorage.getItem(key));
        if (item && item.expires > Date.now()) {
            return item.data;
        }
    }

    set(key, data, ttl) {
        window.localStorage.setItem(key, JSON.stringify({
            data,
            expires: Date.now() + ttl * 1000,
        }));
    }

}();
