import { Component, RouterComponent } from 'appable';

import template from './main.component.html';

import { MdlService } from '../shared/services/mdl.service';
import { CourseService } from '../courses/shared/services/course.service';

export class MainComponent extends Component {

    course = CourseService.get();

    constructor() {
        super('app-main', template);
    }

    onUpdate() {
        MdlService.upgradeOne(`${this.selector} .mdl-button`);
    }

    show(courseName) {
        RouterComponent.navigate('course', { course: courseName });
    }

    showAll() {
        RouterComponent.navigate('courses');
    }

}
