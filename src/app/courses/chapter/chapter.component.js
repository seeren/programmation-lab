import { Component, RouterComponent, StateService } from 'appable';

import Prism from 'prismjs';

import template from './chapter.component.html';

import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ImageService } from '../../shared/services/image.service';
import { MdlService } from '../../shared/services/mdl.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { ChapterService } from './chapter.service';
import { ColorService } from '../shared/services/color.service';

export class ChapterComponent extends Component {

    #onScroll;

    chapter;

    section;

    color;

    constructor() {
        super('app-chapter', template);
    }

    onInit() {
        this.section = decodeURI(RouterComponent.get('section'));
    }

    onUpdate() {
        ChapterService.notify();
        if (this.chapter) {
            ImageService.lazyLoad(`${this.selector} .img-loader`);
            MdlService
                .upgradeOne(`${this.selector} .mdl-js-ripple-effect`)
                .upgradeAll(`${this.selector} .mdl-js-spinner`);
            this.#onScroll = ScrollService.add(`${this.selector} .mdl-tabs__tab-bar`, 16);
            Prism.highlightAll();
        } else if (!this.components.length) {
            this.#show(decodeURI(RouterComponent.get('course')), decodeURI(RouterComponent.get('chapter')));
        }
    }

    onDestroy() {
        if (this.chapter) {
            ScrollService.remove(this.#onScroll);
            this.chapter = null;
        }
        this.components.forEach((component) => this.detach(component));
    }

    onStep(escapedSection) {
        ScrollService.top();
        const section = unescape(escapedSection);
        if (section !== this.section) {
            StateService.get().param.section = section;
            window.history.replaceState(
                StateService.get(),
                'chapter', `/formations/${RouterComponent.get('course')}/${RouterComponent.get('chapter')}/${section}`,
            );
            ChapterService.notify();
        }
    }

    onNext(index) {
        const tabs = window.document.querySelectorAll(`${this.selector} .mdl-tabs__tab`);
        if (index !== tabs.length - 1) {
            tabs[index + 1].click();
        } else {
            ChapterService.terminate(this.chapter);
            RouterComponent.navigate('course', { course: RouterComponent.get('course') });
        }
    }

    async #show(courseName, chapterName) {
        const [spinner, retry] = SpinnerService.start(
            this,
            () => this.#show(courseName, chapterName),
        );
        try {
            this.chapter = await ChapterService.fetch(courseName, chapterName);
            this.color = ColorService.get(courseName);
            this.detach(spinner);
        } catch (error) {
            if (!(error instanceof AbortError)) {
                this.attach(retry);
            }
        } finally {
            this.update();
        }
    }

}
