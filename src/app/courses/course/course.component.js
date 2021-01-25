import { Component, RouterComponent } from 'appable';

// @ts-ignore
import template from './course.component.html';

import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { AbortError } from '../../shared/errors/abort.error';
import { CourseService } from './course.service';
import { ScrollService } from '../../shared/services/scroll.service';
import { MdlService } from '../../shared/services/mdl.service';
import { AbortService } from '../../shared/services/abort.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';

/**
 * @type {CourseComponent}
 */
export class CourseComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course', template });
    }

    /**
     * @emits
     */
    onInit() {
        this.course = null;
        this.percent = null;
    }

    onUpdate() {
        if (this.course && this.course.readme) {
            MdlService
                .upgradeOne(`${this.selector} .mdl-tabs`)
                .upgradeAll(`${this.selector} .mdl-tabs__ripple-container`);
            this.onScroll = ScrollService.add(`${this.selector} .mdl-tabs__tab-bar`, 16);
        } else if (!this.components.length) {
            this.onAbort = AbortService.add(CourseService);
            this.show(RouterComponent.get('name'));
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        if (this.course && this.course.readme) {
            ScrollService.remove(this.onScroll);
        }
        this.components.forEach((component) => this.detach(component));
        this.course = null;
    }

    /**
     * @param {String} name
     */
    show(name) {
        const spinner = new SpinnerComponent();
        const retry = SpinnerService.start(this, spinner, () => this.show(name));
        CourseService.get(name)
            .then((data) => {
                this.course = data;
                this.percent = CourseService.toPercent(data);
            })
            .catch((error) => error instanceof AbortError || this.attach(retry))
            .finally(() => {
                AbortService.remove(this.onAbort);
                if (this.components.length || this.course) {
                    this.detach(spinner);
                    this.update();
                }
            });
    }

    /**
     * @event
     * @param {Number} wikiIndex
     * @param {Number} sectionIndex
     */
    showChapter(wikiIndex, sectionIndex) {
        const wiki = this.course.wikiList[wikiIndex];
        RouterComponent.navigate('chapitre', {
            name: RouterComponent.get('name'),
            chapter: wiki.document.querySelector('h1').innerText,
            section: wiki.document.querySelectorAll('h2')[sectionIndex].innerText.substring(3),
        });
    }

    /**
     * @param {Number} id
     */
    toggle(id) {
        const className = 'open';
        const summary = window.document.querySelector(`${this.selector} .summary-${id}`);
        const btn = window.document.querySelector(`${this.selector} .summary-${id} .material-icons`);
        if (summary.classList.contains(className)) {
            summary.classList.remove(className);
            btn.innerHTML = 'keyboard_arrow_down';
        } else {
            summary.classList.add(className);
            btn.innerHTML = 'keyboard_arrow_up';
        }
    }

}
