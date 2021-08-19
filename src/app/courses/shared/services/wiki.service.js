import { Markdown } from '../models/markdown.model';
import { AbortError } from '../../../shared/errors/abort.error';
import { NetworkError } from '../../../shared/errors/network.error';
import { AbortService } from '../../../shared/services/abort.service';
import { HttpClientService } from '../../../shared/services/http-client.service';

export const WikiService = new class extends HttpClientService {

    async fetch(url) {
        try {
            AbortService.add(WikiService);
            const wiki = new Markdown();
            wiki.raw = await (fetch(url, { signal: this.controller.signal })
                .then((response) => response.text()));
            wiki.checked = false;
            return wiki;
        } catch (error) {
            throw error instanceof DOMException ? new AbortError() : new NetworkError();
        }
    }

}();
