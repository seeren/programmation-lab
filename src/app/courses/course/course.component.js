import { Component, RouterComponent, RouterService } from 'appable';

// @ts-ignore
import template from './course.component.html';

import { RetryComponent } from '../../shared/components/retry/retry.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { AbortError } from '../../shared/errors/abort.error';
import { CourseService } from './course.service';
import { StickyEventService } from '../../shared/services/events/sticky.event.service';

/**
 * @type {CourseComponent}
 */
export class CourseComponent extends Component {

    /**
     * @constructor
     */
    constructor() {
        super({ selector: 'app-course', template });
        this.course = null;
    }

    onUpdate() {
        if (this.course && this.course.readme) {
            global.componentHandler.upgradeElement(document.querySelector(`${this.selector} .mdl-tabs`));
            document.querySelector('main.mdl-layout__content').addEventListener(
                'scroll',
                this.onScroll = (event) => StickyEventService.onscroll(
                    event.target,
                    document.querySelector(`${this.selector} .mdl-tabs__tab-bar`),
                    16,
                ),
            );
        } else if (!this.components.length) {
            RouterService.attach(this.onAbort = () => {
                CourseService.abort();
                RouterService.detach(this.onAbort);
                delete this.onAbort;
            });
            this.show(RouterComponent.get('name'));
        }
    }

    /**
     * @emits
     */
    onDestroy() {
        this.course = null;
        if (this.onScroll) {
            document.querySelector('main.mdl-layout__content').removeEventListener('scroll', this.onScroll);
        }
    }

    /**
     * @param {number} id
     */
    toggle(id) {
        const className = 'open';
        const summary = window.document.querySelector(`${this.selector} .summary-${id}`);
        const btn = window.document.querySelector(`${this.selector} .summary-${id} .material-icons`);
        if (summary.classList.contains(className)) {
            summary.classList.remove(className);
            btn.innerHTML = 'keyboard_arrow_down';
        } else {
            summary.classList.add(className);
            btn.innerHTML = 'keyboard_arrow_up';
        }
    }

    /**
     * @param {String} name
     */
    show(name) {
        const retry = new RetryComponent();
        const spinner = new SpinnerComponent();
        retry.onRetry = () => {
            this.detach(retry);
            this.show(name);
        };
        this.attach(spinner);
        this.update();
        CourseService.get(name)
            .then((course) => {
                this.course = course;
                this.detach(spinner);
                this.update();
            })
            .catch((e) => {
                this.detach(spinner);
                if (!(e instanceof AbortError)) {
                    this.attach(retry);
                    this.update();
                }
            });
    }

    /**
     * @event
     * @param {String} chapter
     * @param {String} section
     */
    chapter(chapter, section) {
        RouterComponent.navigate('chapitre', {
            name: RouterComponent.get('name'),
            chapter,
            section: section.trim(),
        });
    }

}
