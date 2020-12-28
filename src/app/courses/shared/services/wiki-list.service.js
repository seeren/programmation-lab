import { environment } from '../../../../../environment/environment.prod';
import { HttpClientService } from '../../../shared/services/http-client.service';
import { RateError } from '../../../shared/errors/rate.error';
import { Wiki } from '../models/wiki.model';
import { WikiService } from './wiki.service';

/**
 * @type {WikiListService}
 */
// @ts-ignore
export const WikiListService = new class extends HttpClientService {

    /**
     * @param {String} name
     * @returns {Promise<Array<Wiki>>}
     */
    get(name) {
        return new Promise((resolve, reject) => {
            this.xhr = this.request(reject);
            this.xhr.open('GET', `https://api.github.com/repos/${environment.organisation}/${name}/contents/wiki`);
            this.xhr.setRequestHeader('Authorization', `token ${environment.token}`);
            this.xhr.onload = () => this.onload(resolve, reject);
            this.xhr.send();
        });
    }

    /**
     * @param {Function} resolve
     * @param {Function} reject
     */
    onload(resolve, reject) {
        const wikiList = [];
        const wikiUrlList = JSON.parse(this.xhr.response);
        if (!Array.isArray(wikiUrlList)) {
            return reject(new RateError());
        }
        wikiUrlList.pop();
        const getListByUrl = () => (wikiUrlList.length
            ? WikiService.get(wikiUrlList[0].download_url).then((wiki) => {
                wikiList.push(wiki);
                wikiUrlList.shift();
                getListByUrl();
            }).catch((e) => reject(e))
            : resolve(wikiList));
        getListByUrl();
    }

}();
