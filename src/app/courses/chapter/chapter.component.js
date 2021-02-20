import { Component, RouterComponent, RouterService } from 'appable';

import Prism from 'prismjs';

import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { AbortService } from '../../shared/services/abort.service';
import { ImageService } from '../../shared/services/image.service';
import { MdlService } from '../../shared/services/mdl.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { Wiki } from '../shared/models/wiki.model';
import { ColorService } from '../shared/services/color.service';

// @ts-ignore
import template from './chapter.component.html';
import { ChapterService } from './chapter.service';

/**
 * @type {ChapterComponent}
 */
export class ChapterComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-chapter', template });
    }

    /**
     * @emits
     */
    onInit() {
        this.chapter = null;
        this.section = RouterComponent.get('section');
        ChapterService.notify();
    }

    /**
     * @emits
     */
    onUpdate() {
        if (this.chapter) {
            ImageService.lazyLoad(`${this.selector} .img-loader`);
            MdlService.upgradeOne(`${this.selector} .mdl-js-ripple-effect`);
            MdlService.upgradeAll(`${this.selector} .mdl-js-spinner`);
            this.onScroll = ScrollService.add(`${this.selector} .mdl-tabs__tab-bar`, 16);
            Prism.highlightAll();
        } else if (!this.components.length) {
            this.onAbort = AbortService.add(ChapterService);
            this.show(RouterComponent.get('course'), RouterComponent.get('chapter'));
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        if (this.chapter) {
            ScrollService.remove(this.onScroll);
        }
        this.components.forEach((component) => this.detach(component));
    }

    /**
     * @param {String} course
     * @param {String} chapter
     */
    show(course, chapter) {
        const spinner = new SpinnerComponent();
        const retry = SpinnerService.start(this, spinner, () => this.show(course, chapter));
        ChapterService.get(course, chapter)
            .then(

                /**
                 * @param {Wiki} data
                 */
                (data) => {
                    this.chapter = data;
                    this.color = ColorService.get(course);
                },
            )
            .catch(

                /**
                 * @param {Error} error
                 */
                (error) => error instanceof AbortError || this.attach(retry),
            )
            .finally(() => {
                AbortService.remove(this.onAbort);
                if (this.components.length || this.chapter) {
                    this.detach(spinner);
                    this.update();
                }
            });
    }

    /**
     * @param {String} escapedSection
     */
    step(escapedSection) {
        ScrollService.top();
        const section = unescape(escapedSection);
        if (section !== this.section) {
            this.section = section;
            RouterService.get()[`${'param'}`].section = section;
            ChapterService.notify();
        }
    }

    /**
     * @event
     * @param {Number} index
     */
    next(index) {
        const tabs = window.document.querySelectorAll(`${this.selector} .mdl-tabs__tab`);
        if (index !== tabs.length - 1) {
            tabs[index + 1][`${'click'}`]();
        } else {
            ChapterService.terminate(this.chapter);
            RouterComponent.navigate('course', { course: RouterComponent.get('course') });
        }
    }

}
