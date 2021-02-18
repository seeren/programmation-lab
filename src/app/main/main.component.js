import { Component, RouterComponent } from 'appable';

// @ts-ignore
import template from './main.component.html';

import { LastService } from '../courses/shared/services/last.service';
import { MdlService } from '../shared/services/mdl.service';

/**
 * @type {MainComponent}
 */
export class MainComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-main', template });
    }

    /**
     * @emits
     */
    onInit() {
        this.last = LastService.last;
    }

    /**
     * @emits
     */
    onUpdate() {
        MdlService.upgradeOne(`${this.selector} .mdl-button`);
    }

    /**
     * @event
     * @param {String} course
     */
    show(course) {
        RouterComponent.navigate('course', { course });
    }

    /**
     * @event
     */
    showAll() {
        RouterComponent.navigate('courses');
    }

}
