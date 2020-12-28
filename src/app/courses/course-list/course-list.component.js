import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { StickyEventService } from '../../shared/services/events/sticky.event.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RetryComponent } from '../../shared/components/retry/retry.component';
import { CourseListService } from './couse-list.service';
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
    }

    /**
     * @emits
     */
    onUpdate() {
        if (this.courseList) {
            document.querySelector('main.mdl-layout__content').addEventListener(
                'scroll',
                this.onScroll = (event) => StickyEventService.onscroll(
                    event.target,
                    document.querySelector(`${this.selector} .mdl-layout__header`),
                    // @ts-ignore
                    document.querySelector(`${this.selector} header`).offsetHeight - 36,
                ),
            );
            window.addEventListener('resize', this.onResize = () => {
                this.onDestroy();
                this.onUpdate();
            });
        } else if (!this.components.length) {
            RouterService.attach(this.onAbort = () => {
                CourseListService.abort();
                RouterService.detach(this.onAbort);
                delete this.onAbort;
            });
            this.showAll();
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        if (this.onScroll) {
            document.querySelector('main.mdl-layout__content').removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onResize);
        } else if (this.components.length) {
            this.components.forEach((component) => this.detach(component));
        }
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
        CourseListService.get()
            .then(() => {
                this.detach(spinner);
                this.courseList = CourseListService.courseList;
                this.update();
            })
            .catch((e) => {
                this.detach(spinner);
                if (!(e instanceof AbortError)) {
                    this.attach(retry);
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
