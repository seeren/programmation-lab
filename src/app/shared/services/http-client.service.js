import { Service } from 'appable';

export class HttpClientService extends Service {

    #controller;

    get controller() {
        return this.#controller = new AbortController();
    }

    abort() {
        this.#controller.abort();
    }

}
