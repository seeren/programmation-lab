import { Component, RouterComponent } from 'appable';

import template from './favorite-list.component.html';

import { FavoriteListService } from './favorite-list.service';
import { ColorService } from '../../courses/shared/services/color.service';

export class FavoriteListComponent extends Component {

    favoriteList = FavoriteListService.favoriteList;

    constructor() {
        super('app-favorite-list', template);
    }

    onInit() {
        this.favoriteList.sort((a, b) => a.course > b.course);
    }

    onFavorite(index) {
        const favorite = FavoriteListService.favoriteList[index];
        RouterComponent.navigate('chapter', {
            course: favorite.course,
            chapter: favorite.chapter,
            section: favorite.section,
        });
    }

    getColor(courseName) {
        return ColorService.get(courseName);
    }

}
