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
import { Course } from './cours.model';

/**
 * @type {CourseComponent}
 */
export class CourseComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course', template });
        this.tab = 'description';
    }

    /**
     * @emits
     */
    onInit() {
        this.course = null;
    }

    onUpdate() {
        if (this.course && this.course.readme) {
            MdlService
                .upgradeOne(`${this.selector} .mdl-tabs`)
                .upgradeAll(`${this.selector} .mdl-tabs__ripple-container`);
            this.onScroll = ScrollService.add(`${this.selector} .mdl-tabs__tab-bar`, 16);
        } else if (!this.components.length) {
            this.onAbort = AbortService.add(CourseService);
            this.show(RouterComponent.get('course'));
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
    }

    /**
     * @param {String} tab
     */
    open(tab) {
        this.tab = tab;
    }

    /**
     * @event
     * @param {Number} id
     */
    toggle(id) {
        const className = 'open';
        const summary = window.document.querySelector(`${this.selector} .summary-${id}`);
        const btn = window.document.querySelector(`${this.selector} .summary-${id} .toggle`);
        if (summary.classList.contains(className)) {
            summary.classList.remove(className);
            btn.innerHTML = 'keyboard_arrow_down';
        } else {
            summary.classList.add(className);
            btn.innerHTML = 'keyboard_arrow_up';
        }
    }

    /**
     * @param {String} course
     */
    show(course) {
        const spinner = new SpinnerComponent();
        const retry = SpinnerService.start(this, spinner, () => this.show(course));
        CourseService.get(course)
            .then(

                /**
                 * @param {Course} data
                 */
                (data) => {
                    this.course = data;
                    this.percent = CourseService.toPercent(data);
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
        RouterComponent.navigate('chapter', {
            course: RouterComponent.get('course'),
            chapter: this.course.wikiList[wikiIndex].document.querySelector('h1').innerText,
            section: this.course.wikiList[wikiIndex].document.querySelectorAll('h2')[sectionIndex].innerText.substring(3),
        });
    }

}
