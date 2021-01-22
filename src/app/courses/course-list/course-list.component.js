import { Component, RouterComponent } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RetryComponent } from '../../shared/components/retry/retry.component';
import { CourseListService } from './couse-list.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ScrollService } from '../../shared/services/scroll.service';
import { ResizeService } from '../../shared/services/resize.service';
import { AbortService } from '../../shared/services/abort.service';
import { Course } from '../course/cours.model';

/**
 * @type {CourseListComponent}
 */
export class CourseListComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course-list', template });
        this.courseList = null;
    }

    /**
     * @emits
     * @param {HTMLElement} element
     */
    onUpdate(element) {
        if (this.courseList) {
            const offset = element.getElementsByTagName('header')[0].offsetHeight - 36;
            this.onScroll = ScrollService.add(`${this.selector} .mdl-layout__header`, offset);
            this.onResize = ResizeService.add(this, element);
        } else if (!this.components.length) {
            this.onAbort = AbortService.add(CourseListService);
            this.showAll();
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        if (this.onScroll) {
            ScrollService.remove(this.onScroll);
            ResizeService.remove(this.onResize);
        }
    }

    /**
     * @event
     */
    showAll() {
        const spinner = new SpinnerComponent();
        const retry = this.showAllStart(spinner);
        CourseListService.get()
            .then((data) => this.showAllSuccess(data))
            .catch((error) => this.showAllError(retry, error))
            .finally(() => this.showAllEnd(spinner));
    }

    /**
     * @param {SpinnerComponent} spinner
     * @returns {RetryComponent}
     */
    showAllStart(spinner) {
        const retry = new RetryComponent();
        retry.onRetry = () => {
            this.detach(retry);
            this.showAll();
        };
        this.attach(spinner);
        this.update();
        return retry;
    }

    /**
     * @param {Course[]} courseList
     */
    showAllSuccess(courseList) {
        this.courseList = courseList;
        this.update();
    }

    /**
     * @param {RetryComponent} retry
     * @param {Error} error
     */
    showAllError(retry, error) {
        if (!(error instanceof AbortError)) {
            this.attach(retry);
            this.update();
        }
    }

    /**
     * @param {SpinnerComponent} spinner
     */
    showAllEnd(spinner) {
        AbortService.remove(this.onAbort);
        this.detach(spinner);
    }

    /**
     * @event
     * @param {String} name
     */
    show(name) {
        RouterComponent.navigate('formation', { name });
    }

}
