import { Component } from 'appable';

import template from './app.component.html';

import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { MdlService } from './shared/services/mdl.service';

export class AppComponent extends Component {

    constructor() {
        super('app', template, [new NavigationComponent()]);
    }

    onUpdate() {
        MdlService.upgrade();
    }

}
