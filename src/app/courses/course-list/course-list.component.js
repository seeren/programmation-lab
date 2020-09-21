import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { StickyEventService } from '../../shared/services/events/sticky.event.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RetryComponent } from '../../shared/components/retry/retry.component';
import { CousesListService } from '../../shared/services/couses-list.service';
import { AbortError } from '../../shared/errors/abort.error';

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

        /**
         * @event
         */
        this.onResize = () => {
            this.onDestroy();
            this.onUpdate();
        };

        /**
         * @event
         */
        this.onAbort = () => {
            if (1 === CousesListService.xhr.readyState) {
                CousesListService.xhr.onabort();
            }
            RouterService.detach(this.onAbort);
        };
    }

    /**
     * @emits
     */
    onInit() {
        RouterService.attach(this.onAbort);
    }

    /**
     * @emits
     */
    onUpdate() {
        if (this.courseList) {

            /**
             * @event
             * @param {Event} event
             */
            this.onScroll = (event) => StickyEventService.onscroll(
                event.target,
                document.querySelector(`${this.selector} .mdl-layout__header`),
                // @ts-ignore
                document.querySelector(`${this.selector} header`).offsetHeight - 36,
            );

            document.querySelector('main.mdl-layout__content').addEventListener('scroll', this.onScroll);
            window.addEventListener('resize', this.onResize);
        } else if (!this.components.length) {
            this.showAll();
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        document.querySelector('main.mdl-layout__content').removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
        this.components.forEach((component) => this.detach(component));
    }

    /**
     * @event
     */
    showAll() {
        const retry = new RetryComponent();
        const spinner = new SpinnerComponent();
        this.before(spinner, retry);
        CousesListService.fetch()
            .then(() => this.success(spinner))
            .catch((e) => (e instanceof AbortError ? null : this.error(spinner, retry)));
    }

    /**
     * @event
     * @param {String} courseName
     */
    show(courseName) {
        RouterComponent.navigate('formation', { name: courseName.toLowerCase() });
    }

    /**
     * @param {Component} spinner
     * @param {RetryComponent} retry
     */
    before(spinner, retry) {
        retry.onRetry = () => {
            this.detach(retry);
            this.showAll();
        };
        this.attach(spinner);
        this.update();
    }

    /**
     * @param {Component} spinner
     */
    success(spinner) {
        this.courseList = CousesListService.courseList;
        this.detach(spinner);
        this.update();
    }

    /**
     * @param {Component} spinner
     * @param {Component} retry
     */
    error(spinner, retry) {
        this.attach(retry);
        this.detach(spinner);
        this.update();
    }

}
