import { Component, RouterComponent, StateService } from 'appable';

import template from './navigation.component.html';

import { MdlService } from '../../services/mdl.service';
import { ScrollService } from '../../services/scroll.service';
import { FavoriteListService } from '../../../favorites/favorite-list/favorite-list.service';
import { ChapterService } from '../../../courses/chapter/chapter.service';

export class NavigationComponent extends Component {

    routeName;

    #onScroll;

    constructor() {
        super('app-navigation', template);
        StateService.attach(() => this.#onStateChange());
        ChapterService.attach(() => this.#onChapterChange());
    }

    onUpdate() {
        MdlService
            .downGrade(`${this.selector}.mdl-layout`)
            .upgradeOne(`${this.selector}.mdl-layout`)
            .upgradeOne(`${this.selector} .mdl-snackbar`)
            .upgradeAll(`${this.selector} .mdl-layout__tab-ripple-container`);
        this.#onScroll = ScrollService.add(`${this.selector} .mdl-layout__header`, 0);
        ScrollService.top();
    }

    onDestroy() {
        const element = document.querySelector(this.selector);
        const parent = element.parentNode;
        parent.parentNode.insertBefore(element, parent);
        parent.parentNode.removeChild(parent);
        ScrollService.remove(this.#onScroll);
    }

    onNavigateBack() {
        RouterComponent.back();
    }

    onNavigate(routeName) {
        RouterComponent.navigate(routeName);
    }

    onToogleFavorite(event) {
        const state = StateService.get();
        const favorite = FavoriteListService.find(state.param);
        event.preventDefault();
        event.stopImmediatePropagation();
        const data = { };
        if (favorite) {
            data.message = 'Extrait supprimé';
            FavoriteListService.remove(favorite);
        } else {
            data.message = 'Extrait ajouté';
            FavoriteListService.add(state.param);
        }
        document.querySelector(`${this.selector} .mdl-snackbar`).MaterialSnackbar.showSnackbar(data);
        this.#onChapterChange();
    }

    #onStateChange() {
        const state = StateService.get();
        this.routeName = state.name;
        switch (this.routeName) {
        case 'courses':
            this.title = 'Thématiques';
            break;
        case 'course':
            this.title = decodeURI(state.param.course);
            break;
        case 'chapter':
            this.title = decodeURI(state.param.chapter);
            break;
        case 'favorites':
            this.title = 'Extraits';
            break;
        default:
            this.title = 'Programmation Lab';
        }
        if (window.document.querySelector('main.mdl-layout__content')) {
            this.onDestroy();
            this.update();
        }
    }

    #onChapterChange() {
        const tab = window.document.querySelector(`${this.selector} .mdl-layout__tab.chapter`);
        return FavoriteListService.find(StateService.get().param)
            ? tab.classList.add('is-active')
            : tab.classList.remove('is-active');
    }

}
