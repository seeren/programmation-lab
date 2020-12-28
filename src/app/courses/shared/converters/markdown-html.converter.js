/* eslint-disable no-cond-assign */

/**
 * @type {MarkdownHTML}
 */
export class MarkdownHTML {

    /**
     * @param {String} markdown
     * @returns {Array<Node>}
     */
    convert(markdown) {
        const nodeList = [];
        let previous = null;
        let current = null;
        markdown.split(/[\r\n]+/).forEach((line) => {
            if (previous !== (current = this.convertLine(line, previous))) {
                nodeList.push(current);
            }
            previous = current;
        });
        return nodeList;
    }

    /**
     * @param {String} line
     * @param {?HTMLElement} previous
     * @returns {HTMLElement}
     */
    convertLine(line, previous) {
        let matches = null;
        if (/^\|.+\|$/.exec(line)) {
            return this.convertTable(null, previous, line);
        }
        if (matches = /^```(.+)?/.exec(line)) {
            return this.convertCode(matches, previous);
        }
        if (previous && previous.getAttribute('data-state')) {
            return this.convertCode(null, previous, line);
        }
        if (matches = /^(\s+)?[*]+/.exec(line)) {
            return this.convertItem(matches, previous);
        }
        if (matches = /^[#]+/.exec(line)) {
            return this.convertTitle(matches);
        }
        if (matches = /^>\s?(.+)/.exec(line)) {
            return this.convertCitation(matches);
        }
        if (matches = /^!\[(.+)]\((.+)\)$/.exec(line)) {
            return this.convertImage(matches);
        }
        if (!line) {
            return window.document.createElement('br');
        }
        if ('___' === line) {
            return window.document.createElement('hr');
        }
        return this.buildChildNodes(window.document.createElement('p'), line);
    }

    /**
     * @param {Array<String>} matches
     * @param {?HTMLElement} previous
     * @param {String} line
     * @returns {HTMLElement}
     */
    convertTable(matches, previous, line) {
        // eslint-disable-next-line no-param-reassign
        matches = line.split('|');
        matches.pop();
        matches.shift();
        const raw = window.document.createElement('tr');
        if (!previous || 'TABLE' !== previous.tagName) {
            // eslint-disable-next-line no-param-reassign
            previous = window.document.createElement('table');
            const thead = window.document.createElement('thead');
            previous.appendChild(thead);
            thead.appendChild(raw);
        } else if (1 === previous.childNodes.length) {
            previous.appendChild(window.document.createElement('tbody'));
            return previous;
        } else if (2 === previous.childNodes.length) {
            previous.childNodes[1].appendChild(raw);
        }
        matches.forEach((match) => {
            const cell = window.document.createElement('td');
            cell.appendChild(document.createTextNode(match));
            raw.appendChild(cell);
        });
        return previous;
    }

    /**
     * @param {RegExpExecArray} matches
     * @param {?HTMLElement} previous
     * @param {?String} line
     * @returns {HTMLElement}
     */
    convertCode(matches, previous, line = null) {
        if (line) {
            const text = document.createTextNode(line);
            previous.appendChild(text);
            previous.appendChild(document.createElement('br'));
            return previous;
        }
        if (previous.getAttribute('data-state')) {
            previous.removeAttribute('data-state');
            previous.removeChild(previous.lastChild);
            return previous;
        }
        const element = window.document.createElement('code');
        element.setAttribute('data-language', matches[1]);
        element.setAttribute('data-state', 'open');
        return element;
    }

    /**
     * @param {RegExpExecArray} matches
     * @param {?HTMLElement} previous
     * @returns {HTMLElement}
     */
    convertItem(matches, previous) {
        const offset = matches[1] ? matches[1].length : 0;
        const item = this.buildChildNodes(
            window.document.createElement('li'),
            matches.input.substring(2 + offset),
        );
        if (!previous || 'UL' !== previous.tagName) {
            const element = window.document.createElement('ul');
            element.appendChild(item);
            return element;
        }
        let nested = null;
        if (!offset) {
            nested = previous;
        } else if (!(nested = previous.getElementsByTagName('ul')[(offset / 2) - 1])) {
            const itemList = previous.getElementsByTagName('li');
            nested = window.document.createElement('ul');
            itemList[itemList.length - 1].appendChild(nested);
        }
        nested.appendChild(item);
        return previous;
    }

    /**
     * @param {RegExpExecArray} matches
     * @returns {HTMLElement}
     */
    convertTitle(matches) {
        const level = matches[0].length;
        return this.buildChildNodes(
            window.document.createElement(`h${level}`),
            matches.input.substring(level + 1),
        );
    }

    /**
     * @param {RegExpExecArray} matches
     * @returns {HTMLElement}
     */
    convertImage(matches) {
        const element = window.document.createElement('img');
        [element.alt, element.src] = [matches[1], matches[2]];
        return element;
    }

    /**
     * @param {RegExpExecArray} matches
     * @returns {HTMLElement}
     */
    convertCitation(matches) {
        return this.buildChildNodes(window.document.createElement('blockquote'), matches[1]);
    }

    /**
     * @param {HTMLElement} element
     * @param {String} line
     * @returns {HTMLElement}
     */
    buildChildNodes(element, line) {
        let html = line;
        let matches = null;
        let regexp = null;
        regexp = /\*\*([^**]+)\*\*/g;
        while (matches = regexp.exec(line)) {
            html = html.replace(matches[0], `<strong>${matches[1]}</strong>`);
        }
        regexp = /\*([^**]+)\*/g;
        while (matches = regexp.exec(line)) {
            html = html.replace(matches[0], `<em>${matches[1]}</em>`);
        }
        regexp = /!\[(.+)]\((.+)\)/g;
        while (matches = regexp.exec(line)) {
            html = html.replace(matches[0], `<img alt="${matches[1]}" src="${matches[2]}" />`);
        }
        regexp = /\[(.+)]\((.+)\)/g;
        while (matches = regexp.exec(line)) {
            html = html.replace(matches[0], `<a href="${matches[2]}">${matches[1]}</a>`);
        }
        element.innerHTML = html;
        return element;
    }

}
