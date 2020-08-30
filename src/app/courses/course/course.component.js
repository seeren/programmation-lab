import { Component } from 'appable';

// @ts-ignore
import template from './course.component.html';

/**
 * @type {CourseComponent}
 */
export class CourseComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course', template });
    }

}
