import { Component } from 'appable';

// @ts-ignore
import template from './app.component.html';

import { NavigationComponent } from './navigation/navigation.component';

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
