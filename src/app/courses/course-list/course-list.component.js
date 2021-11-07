import { Component, RouterComponent } from 'appable';

import template from './course-list.component.html';

import { CourseListService } from './couse-list.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ScrollService } from '../../shared/services/scroll.service';
import { ResizeService } from '../../shared/services/resize.service';
import { MdlService } from '../../shared/services/mdl.service';
import { CourseListFilter } from './course-list.filter';

export class CourseListComponent extends Component {

    #onScroll;

    #onResize;

    fetched = false;

    courseList = CourseListService.courseList;

    type = 1;

    constructor() {
        super('app-course-list', template);
    }

    onUpdate(element) {
        if (this.fetched) {
            this.#onScroll = ScrollService.add(
                `${this.selector} .mdl-layout__header`,
                element.getElementsByTagName('header')[0].offsetHeight - 36,
            );
            this.#onResize = ResizeService.add(this, element);
            MdlService.upgrade('.mdl-menu');
        } else if (!this.components.length) {
            this.#showAll();
        }
    }

    onDestroy() {
        if (this.courseList.length) {
            ScrollService.remove(this.#onScroll);
            ResizeService.remove(this.#onResize);
        }
        this.components.forEach((component) => this.detach(component));
    }

    onCourse(courseName) {
        RouterComponent.navigate('course', { course: courseName });
    }

    filter(type) {
        const filter = new CourseListFilter();
        if (type === this.type) {
            this.courseList.reverse();
        } else {
            filter.filter(this.courseList, type);
        }
        this.type = type;
        this.update();
    }

    async #showAll() {
        const [spinner, retry] = SpinnerService.start(this, () => this.#showAll());
        try {
            this.courseList = await CourseListService.fetch();
            this.fetched = true;
            this.detach(spinner);
        } catch (error) {
            if (!(error instanceof AbortError)) {
                this.attach(retry);
            }
        } finally {
            this.update();
        }
    }

}
