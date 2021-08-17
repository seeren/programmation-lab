/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
export class MarkdownHTML {

    #line = /[\r\n]/;

    #table = /^\|.+\|$/;

    #code = /^```(.+)?/;

    #item = /^(\s+)?[*]+/;

    #title = /^[#]+/;

    #citation = /^>\s?(.+)/;

    #image = /^!\[(.+)]\((.+)\)$/;

    #imageEmbed = /!\[(.+)]\((.+)\)/g;

    #link = /\[(.+)]\((.+)\)$/;

    #linkEmbed = /\[(.+)]\((.+)\)/g;

    #mark = /`([^`]+)`/g;

    #strong = /\*\*([^**]+)\*\*/g;

    #italic = /\*([^**]+)\*/g;

    convert(markdown) {
        const document = window.document.createDocumentFragment();
        let currentNode = null;
        let previousNode = null;
        markdown.split(this.#line).forEach((line) => {
            currentNode = this.#convertLine(line, previousNode);
            if (previousNode !== currentNode) {
                document.appendChild(currentNode);
            }
            previousNode = currentNode;
        });
        return document;
    }

    #convertLine(line, previous) {
        let matches = null;
        if (this.#table.exec(line)) {
            return this.#convertTable(null, previous, line);
        }
        if (matches = this.#code.exec(line)) {
            return this.#convertCode(matches, previous);
        }
        if (previous && previous.getAttribute('data-state')) {
            return this.#convertCode(null, previous, line);
        }
        if (matches = this.#item.exec(line)) {
            return this.#convertItem(matches, previous);
        }
        if (matches = this.#title.exec(line)) {
            return this.#convertTitle(matches);
        }
        if (matches = this.#citation.exec(line)) {
            return this.#convertCitation(matches);
        }
        if (matches = this.#image.exec(line)) {
            return this.#convertImage(matches);
        }
        if (!line) {
            return window.document.createElement('br');
        }
        if ('___' === line) {
            return window.document.createElement('hr');
        }
        if (matches = this.#link.exec(line)) {
            const link = window.document.createElement('a');
            [,, link.href] = matches;
            link.appendChild(window.document.createTextNode(matches[1]));
            return link;
        }
        return this.#buildChildNodes(window.document.createElement('p'), line);
    }

    #convertTable(matches, previous, line) {
        matches = line.split('|');
        matches.pop();
        matches.shift();
        const raw = window.document.createElement('tr');
        let cellTag = 'td';
        if (!previous || 'TABLE' !== previous.tagName) {
            cellTag = 'th';
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
            const cell = window.document.createElement(cellTag);
            cell.appendChild(document.createTextNode(match));
            raw.appendChild(cell);
        });
        return previous;
    }

    #convertCode(matches, previous, line = null) {
        if (null !== line) {
            const text = document.createTextNode(line);
            previous.appendChild(text);
            previous.appendChild(document.createTextNode('\n'));
            return previous;
        }
        if (previous.getAttribute('data-state')) {
            previous.removeAttribute('data-state');
            return previous;
        }
        const element = window.document.createElement('code');
        element.setAttribute('data-language', matches[1]);
        element.setAttribute('data-state', 'open');
        return element;
    }

    #convertItem(matches, previous) {
        const offset = matches[1] ? matches[1].length : 0;
        const item = this.#buildChildNodes(
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

    #convertTitle(matches) {
        const level = matches[0].length;
        return this.#buildChildNodes(
            window.document.createElement(`h${level}`),
            matches.input.substring(level + 1),
        );
    }

    #convertImage(matches) {
        const element = window.document.createElement('img');
        [element.alt, element.src] = [matches[1], matches[2]];
        return element;
    }

    #convertCitation(matches) {
        return this.#buildChildNodes(window.document.createElement('blockquote'), matches[1]);
    }

    #buildChildNodes(element, line) {
        let html = line;
        let matches = null;
        while (matches = this.#mark.exec(line)) {
            html = html.replace(matches[0], `<mark>${matches[1]}</mark>`);
        }
        while (matches = this.#strong.exec(line)) {
            html = html.replace(matches[0], `<strong>${matches[1]}</strong>`);
        }
        while (matches = this.#italic.exec(line)) {
            html = html.replace(matches[0], `<em>${matches[1]}</em>`);
        }
        while (matches = this.#imageEmbed.exec(line)) {
            html = html.replace(matches[0], `<img alt="${matches[1]}" src="${matches[2]}" />`);
        }
        while (matches = this.#linkEmbed.exec(line)) {
            html = html.replace(matches[0], `<a href="${matches[2]}">${matches[1]}</a>`);
        }
        element.innerHTML = html;
        return element;
    }

}
