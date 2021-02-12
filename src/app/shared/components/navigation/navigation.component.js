import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './navigation.component.html';

import { MdlService } from '../../services/mdl.service';
import { ScrollService } from '../../services/scroll.service';

/**
 * @type {NavigationComponent}
 */
export class NavigationComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-navigation', template });
        RouterService.attach(() => this.onNavigate());
    }

    /**
     * @emits
     */
    onUpdate() {
        MdlService
            .downGrade(`${this.selector}.mdl-layout`)
            .upgradeOne(`${this.selector}.mdl-layout`)
            .upgradeAll(`${this.selector} .mdl-layout__tab-ripple-container`);
        this.onScroll = ScrollService.add(`${this.selector} .mdl-layout__header`, 0);
    }

    /**
     * @emits
     */
    onDestroy() {
        const element = document.querySelector(this.selector);
        const parent = element.parentNode;
        parent.parentNode.insertBefore(element, parent);
        parent.parentNode.removeChild(parent);
        ScrollService.remove(this.onScroll);
    }

    /**
     * @emits
     */
    onNavigate() {
        const state = RouterService.get();
        if ('formation' === state[`${'name'}`]) {
            this.title = state[`${'param'}`].name;
        } else if ('chapitre' === state[`${'name'}`]) {
            this.title = state[`${'param'}`].chapter;
        } else {
            this.title = state[`${'name'}`];
        }
        if (window.document.querySelector('main.mdl-layout__content')) {
            this.onDestroy();
            this.update();
            ScrollService.top();
        }
    }

    /**
     * @event
     * @param {String} name
     */
    navigate(name) {
        RouterComponent.navigate(name);
    }

    /**
     * @event
     */
    back() {
        RouterComponent.back();
    }

}
