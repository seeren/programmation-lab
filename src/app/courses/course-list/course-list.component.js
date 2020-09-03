import { Component } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { StickyEventService } from '../../shared/services/events/sticky.event.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
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
         * @type {Component}
         */
        this.spinner = new SpinnerComponent();

        /**
         * @type {Array<Course>}
         */
        this.courseList = CousesListService.courseList;

        this.attach(this.spinner);
    }

    /**
     * @emits
     */
    onInit() {
        if (!this.courseList.length) {
            CousesListService.fetch()
                .then(() => {
                    this.detach(this.spinner);
                    this.update();
                })
                .catch(() => { });
        }
    }

    /**
     * @emits
     */
    onUpdate() {
        if (this.courseList.length) {
            const header = document.querySelector(`${this.selector} .mdl-layout__header`);
            const offsetTop = header.getBoundingClientRect().top - 36;

            /**
             * @event
             * @param {Event} event
             */
            this.onScroll = (event) => StickyEventService.sticky(event.target, header, offsetTop);

            document.querySelector('main.mdl-layout__content').addEventListener('scroll', this.onScroll);
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        document.querySelector('main.mdl-layout__content').removeEventListener('scroll', this.onScroll);
    }

}
