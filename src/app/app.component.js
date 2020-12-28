import { Component } from 'appable';

// @ts-ignore
import template from './app.component.html';

import { NavigationComponent } from './shared/components/navigation/navigation.component';

/**
 * @type {AppComponent}
 */
export class AppComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({
            selector: 'app',
            template,
            components: [
                new NavigationComponent(),
            ],
        });
    }

    /**
     * @emits
     */
    onUpdate() {
        global.componentHandler.upgradeDom();
    }

}
