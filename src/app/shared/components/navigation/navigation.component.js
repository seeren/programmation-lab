import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './navigation.component.html';

import { StickyEventService } from '../../services/events/sticky.event.service';

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
        this.title = null;
    }

    /**
     * @emits
     */
    onUpdate() {
        global.componentHandler.downgradeElements(document.querySelector(`${this.selector}.mdl-layout`));
        global.componentHandler.upgradeElement(document.querySelector(`${this.selector}.mdl-layout`));
        document.querySelector('main.mdl-layout__content').addEventListener(
            'scroll',
            this.onScroll = (event) => StickyEventService.onscroll(
                event.target,
                document.querySelector(`${this.selector} .mdl-layout__header`),
                0,
            ),
        );
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
        let title = null;
        const state = RouterService.get();
        // @ts-ignore
        title = state.name;
        // @ts-ignore
        Object.keys(state.param).forEach((key) => {
            // @ts-ignore
            title = state.param[key];
        });
        this.title = title;
        if (document.querySelector('main.mdl-layout__content')) {
            this.onDestroy();
            this.update();
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
