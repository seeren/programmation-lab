import { Component, RouterComponent } from 'appable';

import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { AbortService } from '../../shared/services/abort.service';
import { MdlService } from '../../shared/services/mdl.service';
import { ColorService } from '../shared/services/color.service';

// @ts-ignore
import template from './chapter.component.html';
import { ChapterService } from './chapter.service';

/**
 * @type {ChapterComponent}
 */
export class ChapterComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-chapter', template });
    }

    /**
     * @emits
     */
    onInit() {
        this.color = null;
        this.chapter = null;
        this.length = null;
        this.section = RouterComponent.get('section');
        // this.section = 'Scrum';
    }

    /**
     * @emits
     */
    onUpdate() {
        if (this.chapter) {
            MdlService.upgradeOne(`${this.selector} .mdl-js-ripple-effect`);
        } else if (!this.components.length) {
            this.onAbort = AbortService.add(ChapterService);
            this.show(RouterComponent.get('name'), RouterComponent.get('chapter'));
            // this.show('Agile', 'Présentation des principales approches Agiles');
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        this.components.forEach((component) => this.detach(component));
    }

    /**
     * @param {String} name
     * @param {String} chapter
     */
    show(name, chapter) {
        const spinner = new SpinnerComponent();
        const retry = SpinnerService.start(this, spinner, () => this.show(name, chapter));
        ChapterService.get(name, chapter)
            .then((data) => {
                this.chapter = data;
                this.length = data.document.querySelectorAll('h2').length;
                this.color = ColorService.get(name);
            })
            .catch((error) => error instanceof AbortError || this.attach(retry))
            .finally(() => {
                AbortService.remove(this.onAbort);
                if (this.components.length || this.chapter) {
                    this.detach(spinner);
                    this.update();
                }
            });
    }

    /**
     * @event
     */
    terminate() {
        ChapterService.terminate(this.chapter);
        RouterComponent.navigate('formation', {
            name: RouterComponent.get('name'),
        });
    }

}
