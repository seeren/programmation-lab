import { StateService, Service } from 'appable';

export const AbortService = new class extends Service {

    #onAbort;

    add(httpClientService) {
        if (this.#onAbort) {
            this.clear();
        }
        this.#onAbort = () => {
            httpClientService.abort();
            this.clear();
        };
        StateService.attach(this.#onAbort);
    }

    clear() {
        StateService.detach(this.#onAbort);
        this.#onAbort = null;
    }

}();
