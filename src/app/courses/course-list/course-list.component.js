import { Component, RouterComponent } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { CourseListService } from './couse-list.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ScrollService } from '../../shared/services/scroll.service';
import { ResizeService } from '../../shared/services/resize.service';
import { AbortService } from '../../shared/services/abort.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';

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
        const retry = SpinnerService.start(this, spinner, () => this.showAll());
        CourseListService.get()
            .then((data) => this.courseList = data)
            .catch((error) => error instanceof AbortError || this.attach(retry))
            .finally(() => {
                AbortService.remove(this.onAbort);
                this.detach(spinner);
                if (this.components.length || this.courseList) {
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
