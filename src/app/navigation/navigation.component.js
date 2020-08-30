import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './navigation.component.html';

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
        global.componentHandler.downgradeElements(document.querySelector(`${this.selector}.mdl-layout`));
        global.componentHandler.upgradeDom();

        /**
         * @type {HTMLElement}
         */
        this.main = document.querySelector('main.mdl-layout__content');

        /**
         * @type {HTMLElement}
         */
        this.header = document.querySelector(`${this.selector} .mdl-layout__header`);

        this.main.onscroll = () => this.requested || this.onScroll();
    }

    /**
     * @event
     */
    onScroll() {
        window.requestAnimationFrame(() => {
            if (0 === this.main.scrollTop) {
                this.main.classList.remove('expanded');
                this.header.classList.remove('scrolled');
                delete this.scrolled;
            } else if (!this.scrolled) {
                this.main.classList.add('expanded');
                this.header.classList.add('scrolled');
                this.scrolled = true;
            }
            delete this.requested;
        });
        this.requested = true;
    }

    /**
     * @emits
     */
    onNavigate() {
        // @ts-ignore
        this.title = RouterService.get().name;
        if (this.main) {
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
