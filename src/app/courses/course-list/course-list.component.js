import { Component } from 'appable';

// @ts-ignore
import template from './course-list.component.html';

/**
 * @type {CourseListComponent}
 */
export class CourseListComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course-list', template });
    }

}
