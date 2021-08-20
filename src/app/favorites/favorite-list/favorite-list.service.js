import { Service } from 'appable';

import { environment } from '../../../../environment/environment.prod';

import { Favorite } from './favorite.model';
import { LocalStorageService } from '../../shared/services/local-storage.service';

export const FavoriteListService = new class extends Service {

    #favoriteList = LocalStorageService.get(environment.storage.favoriteList) || [];

    find(favorite) {
        return this.#favoriteList.find((item) => item.course === favorite.course
            && item.chapter === favorite.chapter
            && item.section === favorite.section);
    }

    add(favorite) {
        const newFavorite = new Favorite();
        newFavorite.course = favorite.course;
        newFavorite.chapter = favorite.chapter;
        newFavorite.section = favorite.section;
        this.#favoriteList.unshift(newFavorite);
        this.save();
    }

    remove(favorite) {
        this.#favoriteList.splice(this.#favoriteList.indexOf(this.find(favorite)), 1);
        this.save();
    }

    save() {
        LocalStorageService.set(environment.storage.favoriteList, this.#favoriteList, 86400 * 365);
    }

    get favoriteList() {
        return this.#favoriteList;
    }

}();
