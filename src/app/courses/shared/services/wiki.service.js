import { HttpClientService } from '../../../shared/services/http-client.service';
import { Wiki } from '../models/wiki.model';

/**
 * @type {WikiService}
 */
// @ts-ignore
export const WikiService = new class extends HttpClientService {

    /**
     * @param {String} url
     * @returns {Promise<Wiki|Error>}
     */
    get(url) {
        return new Promise((resolve, reject) => {
            this.xhr = this.request(reject);
            this.xhr.open('GET', url);
            this.xhr.onload = () => {
                const wiki = new Wiki();
                // use wiki builder
                // wiki.raw = this.xhr.response;
                resolve(wiki);
            };
            this.xhr.send();
        });
    }

}();
