import { Component, RouterComponent } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ScrollService } from '../../shared/services/scroll.service';
import { ResizeService } from '../../shared/services/resize.service';
import { AbortService } from '../../shared/services/abort.service';
import { CourseListService } from './couse-list.service';
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
            this.onScroll = ScrollService.add(`${this.selector} .mdl-layout__header`, element.getElementsByTagName('header')[0].offsetHeight - 36);
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
        if (this.courseList) {
            ScrollService.remove(this.onScroll);
            ResizeService.remove(this.onResize);
        }
        this.components.forEach((component) => this.detach(component));
    }

    /**
     * @event
     */
    showAll() {
        const spinner = new SpinnerComponent();
        const retry = SpinnerService.start(this, spinner, () => this.showAll());
        CourseListService.get()
            .then(

                /**
                 * @param {Course[]} data
                 */
                (data) => this.courseList = data,
            )
            .catch(

                /**
                 * @param {Error} error
                 */
                (error) => error instanceof AbortError || this.attach(retry),
            )
            .finally(() => {
                AbortService.remove(this.onAbort);
                if (this.components.length || this.courseList) {
                    this.detach(spinner);
                    this.update();
                }
            });
    }

    /**
     * @event
     * @param {String} course
     */
    show(course) {
        RouterComponent.navigate('course', { course });
    }

}
