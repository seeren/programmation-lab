import { Service } from 'appable';

import { environment } from '../../../environment/environment.prod';

import { LocalStorageService } from '../shared/services/local-storage.service';
import { Favorite } from './favorite.model';

/**
 * @type {FavoriteListService}
 */
// @ts-ignore
export const FavoriteListService = new class extends Service {

    /**
     * @constructor
     */
    constructor() {
        super();

        /**
         * @type {Array<Favorite>}
         */
        this.favoriteList = LocalStorageService.get(environment.storage.favoriteList) || [];

    }

    /**
     * @param {Favorite} data
     * @returns {Favorite}
     */
    clone(data) {
        const favorite = new Favorite();
        favorite.course = data.course;
        favorite.chapter = data.chapter;
        favorite.section = data.section;
        return favorite;
    }

    /**
     * @param {Favorite} favorite
     * @returns {Favorite|undefined}
     */
    find(favorite) {
        return this.favoriteList.find((item) => item.course === favorite.course
            && item.chapter === favorite.chapter
            && item.section === favorite.section);
    }

    /**
     * @param {Favorite} favorite
     */
    add(favorite) {
        this.favoriteList.push(favorite);
        this.save();
    }

    /**
     * @param {Favorite} favorite
     */
    remove(favorite) {
        this.favoriteList.splice(this.favoriteList.indexOf(this.find(favorite)), 1);
        this.save();
    }

    /**
     * @returns {void}
     */
    save() {
        LocalStorageService.set(environment.storage.favoriteList, this.favoriteList, 86400 * 365);
    }

}();
