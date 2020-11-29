import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { StickyEventService } from '../../shared/services/events/sticky.event.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RetryComponent } from '../../shared/components/retry/retry.component';
import { CourseListService } from '../shared/services/couse-list.service';
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
        this.onAbort = () => {
            CourseListService.abort();
            RouterService.detach(this.onAbort);
        };

        /**
         * @event
         */
        this.onResize = () => {
            this.onDestroy();
            this.onUpdate();
        };

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
        retry.onRetry = () => {
            this.detach(retry);
            this.showAll();
        };
        this.attach(spinner);
        this.update();
        CourseListService
            .get()
            .then(() => {
                this.courseList = CourseListService.courseList;
                this.detach(spinner);
                this.update();
            })
            .catch((e) => {
                if (!(e instanceof AbortError)) {
                    this.attach(retry);
                    this.detach(spinner);
                    this.update();
                }
            });
    }

    /**
     * @event
     * @param {String} name
     */
    show(name) {
        RouterComponent.navigate('formation', { name });
    }

}
