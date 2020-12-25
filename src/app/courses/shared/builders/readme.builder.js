import { Markdown } from '../models/markdown/markdown';
import { Readme } from '../models/readme.model';

export class ReadmeBuilder {

    /**
     * @param {String} readmeRaw
     * @returns {Readme}
     */
    build(readmeRaw) {
        const readme = new Readme();
        readme.raw = readmeRaw;
        readme.content = this.buildContent(readmeRaw);
        return readme;
    }

    /**
     * @param {String} readmeRaw
     * @returns {Markdown[]}
     */
    buildContent(readmeRaw) {
        const content = [];
        const lines = readmeRaw.split(/[\r\n]+/);
        let results = null;
        lines.forEach((line) => {

            // Find titles
            results = /^[#]+/.exec(line);
            if (results) {
                console.log(results);
            }

        });
        console.log(lines);
        return content;
    }

}
