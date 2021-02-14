import { Component, RouterComponent } from 'appable';
import { ColorService } from '../../courses/shared/services/color.service';

// @ts-ignore
import template from './favorite-list.component.html';
import { FavoriteListService } from './favorite-list.service';

/**
 * @type {FavoriteListComponent}
 */
export class FavoriteListComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-favorite-list', template });
    }

    /**
     * @emits
     */
    onInit() {
        this.showAll();
    }

    /**
     * @emits
     */
    showAll() {
        this.favoriteList = FavoriteListService.favoriteList;
    }

    /**
     * @event
     * @param {Number} index
     */
    show(index) {
        const favorite = FavoriteListService.favoriteList[index];
        RouterComponent.navigate('chapter', {
            course: favorite.course,
            chapter: favorite.chapter,
            section: favorite.section,
        });
    }

    /**
     * @param {String} course
     */
    color(course) {
        return ColorService.get(course);
    }

}
