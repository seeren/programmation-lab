import { environment } from '../../../../../environment/environment.prod';

import { WikiService } from './wiki.service';
import { AbortError } from '../../../shared/errors/abort.error';
import { NetworkError } from '../../../shared/errors/network.error';
import { RateError } from '../../../shared/errors/rate.error';
import { AbortService } from '../../../shared/services/abort.service';
import { HttpClientService } from '../../../shared/services/http-client.service';

export const WikiListService = new class extends HttpClientService {

    async fetch(courseName) {
        const wikiList = [];
        let wikiUrlList;
        try {
            AbortService.add(WikiListService);
            wikiUrlList = await (fetch(`https://api.github.com/repos/${environment.organisation}/${courseName}/contents/wiki`, {
                signal: this.controller.signal,
                headers: { Authorization: `token ${environment.token}` },
            }).then((response) => response.json()));
        } catch (error) {
            throw error instanceof DOMException ? new AbortError() : new NetworkError();
        }
        if (!Array.isArray(wikiUrlList)) {
            throw new RateError();
        }
        for (const wikiUrl of wikiUrlList.filter((item) => item.download_url)) {
            wikiList.push(await WikiService.fetch(wikiUrl.download_url));
        }
        return wikiList;
    }

}();
