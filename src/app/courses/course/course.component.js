import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './course.component.html';

import { RetryComponent } from '../../shared/components/retry/retry.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { AbortError } from '../../shared/errors/abort.error';
import { CourseService } from './course.service';
import { CourseListService } from '../course-list/couse-list.service';

/**
 * @type {CourseComponent}
 */
export class CourseComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course', template });
        this.course = null;
    }

    /**
     * @emits
     */
    onInit() {
        const name = RouterComponent.get('name');
        this.course = CourseListService.courseList.find((course) => course.name === name);
    }

    onUpdate() {
        if ((!this.course || !this.course.readme) && !this.components.length) {
            RouterService.attach(this.onAbort = () => {
                CourseService.abort();
                RouterService.detach(this.onAbort);
                delete this.onAbort;
            });
            this.show(RouterComponent.get('name'));
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        this.components.forEach((component) => this.detach(component));
    }

    /**
     * @param {String} name
     */
    show(name) {
        const retry = new RetryComponent();
        const spinner = new SpinnerComponent();
        retry.onRetry = () => {
            this.detach(retry);
            this.show(name);
        };
        this.attach(spinner);
        this.update();
        CourseService.get(name)
            .then((course) => {
                console.log(course);
                this.course = course;
                this.detach(spinner);
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

}
