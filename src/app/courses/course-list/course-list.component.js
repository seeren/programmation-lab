import { Component, RouterComponent } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { StickyEventService } from '../../shared/services/events/sticky.event.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { RetryComponent } from '../../shared/components/retry/retry.component';
import { CousesListService } from '../../shared/services/couses-list.service';
import { Course } from '../../shared/models/cours.model';

/**
 * @type {CourseListComponent}
 */
export class CourseListComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course-list', template });

        /**
         * @type {Array<Course>}
         */
        this.courseList = CousesListService.courseList;

        /**
         * @event
         */
        this.onResize = () => {
            this.onDestroy();
            this.onUpdate();
        };
    }

    /**
     * @emits
     */
    onUpdate() {
        if (this.courseList.length) {

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
    }

    /**
     * @event
     */
    showAll() {
        const retry = new RetryComponent();
        const spinner = new SpinnerComponent();
        this.attach(spinner);
        this.update();
        retry.onRetry = () => {
            this.detach(retry);
            this.showAll();
        };
        CousesListService.fetch()
            .catch(() => this.attach(retry))
            .finally(() => {
                this.detach(spinner);
                this.update();
            });
    }

    /**
     * @event
     * @param {String} courseName
     */
    navigate(courseName) {
        RouterComponent.navigate('formation', { name: courseName.toLowerCase() });
    }

}
