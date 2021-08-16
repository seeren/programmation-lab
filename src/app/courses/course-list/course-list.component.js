import { Component, RouterComponent } from 'appable';

import template from './course-list.component.html';

import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ScrollService } from '../../shared/services/scroll.service';
import { ResizeService } from '../../shared/services/resize.service';
import { CourseListService } from './couse-list.service';

export class CourseListComponent extends Component {

    #onScroll;

    #onResize;

    courseList = CourseListService.courseList;

    constructor() {
        super('app-course-list', template);
    }

    onUpdate(element) {
        if (this.courseList) {
            this.#onScroll = ScrollService.add(
                `${this.selector} .mdl-layout__header`,
                element.getElementsByTagName('header')[0].offsetHeight - 36,
            );
            this.#onResize = ResizeService.add(this, element);
        } else if (!this.components.length) {
            this.showAll();
        }
    }

    onDestroy() {
        if (this.courseList) {
            ScrollService.remove(this.#onScroll);
            ResizeService.remove(this.#onResize);
        }
        this.components.forEach((component) => this.detach(component));
    }

    async showAll() {
        const [spinner, retry] = SpinnerService.start(this, () => this.showAll());
        try {
            this.courseList = await CourseListService.fetch();
            this.detach(spinner);
        } catch (error) {
            if (!(error instanceof AbortError)) {
                this.attach(retry);
            }
        } finally {
            this.update();
        }
    }

    show(courseName) {
        RouterComponent.navigate('course', { course: courseName });
    }

}
