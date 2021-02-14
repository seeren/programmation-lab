import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './navigation.component.html';

import { MdlService } from '../../services/mdl.service';
import { ScrollService } from '../../services/scroll.service';
import { FavoriteListService } from '../../../favorites/favorite-list/favorite-list.service';
import { ChapterService } from '../../../courses/chapter/chapter.service';

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
        ChapterService.attach(() => this.upgradeFavorite());
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
        ScrollService.top();
        if ('chapter' === this.route) {
            this.upgradeFavorite();
        }
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
        this.title = state[`${'name'}`];
        this.route = state[`${'name'}`];
        if ('course' === this.title) {
            this.title = state[`${'param'}`].course;
        } else if ('chapter' === this.title) {
            this.title = state[`${'param'}`].chapter;
        }
        if (window.document.querySelector('main.mdl-layout__content')) {
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
     * @param {MouseEvent} event
     */
    toogleFavorite(event) {
        const state = RouterService.get();
        const favorite = FavoriteListService.find(state[`${'param'}`]);
        if (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            if (favorite) {
                FavoriteListService.remove(favorite);
            } else {
                FavoriteListService.add(FavoriteListService.clone(state[`${'param'}`]));
            }
        }
        this.upgradeFavorite();
    }

    /**
     * @event
     */
    upgradeFavorite() {
        const tab = window.document.querySelector(`${this.selector} .mdl-layout__tab.chapter`);
        if (FavoriteListService.find(RouterService.get()[`${'param'}`])) {
            tab.classList.add('is-active');
        } else {
            tab.classList.remove('is-active');
        }
    }

    /**
     * @event
     */
    back() {
        RouterComponent.back();
    }

}
