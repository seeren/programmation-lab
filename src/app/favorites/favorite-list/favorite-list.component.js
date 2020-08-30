import { Component } from 'appable';

// @ts-ignore
import template from './favorite-list.component.html';

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

}
