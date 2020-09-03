import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './navigation.component.html';

import { StickyEventService } from '../shared/services/events/sticky.event.service';

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
        const header = document.querySelector(`${this.selector} .mdl-layout__header`);
        global.componentHandler.downgradeElements(document.querySelector(`${this.selector}.mdl-layout`));
        global.componentHandler.upgradeDom();

        /**
         * @event
         * @param {Event} event
         */
        this.onScroll = (event) => StickyEventService.sticky(event.target, header, 0);

        document.querySelector('main.mdl-layout__content').addEventListener('scroll', this.onScroll);
    }

    /**
     * @emits
     */
    onDestroy() {
        const element = document.querySelector(this.selector);
        const parent = element.parentNode;
        parent.parentNode.insertBefore(element, parent);
        parent.parentNode.removeChild(parent);
        document.querySelector('main.mdl-layout__content').removeEventListener('scroll', this.onScroll);
    }

    /**
     * @emits
     */
    onNavigate() {
        // @ts-ignore
        this.title = RouterService.get().name;
        if (document.querySelector('main.mdl-layout__content')) {
            this.onDestroy();
            this.update();
        }
    }

    /**
     * @event
     * @param {String} section
     */
    navigate(section) {
        RouterComponent.navigate(section);
    }

    /**
     * @event
     */
    back() {
        RouterComponent.back();
    }

}
