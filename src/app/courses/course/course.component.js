import { Component, RouterComponent } from 'appable';

import template from './course.component.html';

import { CourseService } from './course.service';
import { SpinnerService } from '../../shared/components/spinner/spinner.service';
import { AbortError } from '../../shared/errors/abort.error';
import { ScrollService } from '../../shared/services/scroll.service';
import { MdlService } from '../../shared/services/mdl.service';
import { NotFoundError } from '../../shared/errors/not-found.error';

export class CourseComponent extends Component {

    #onScroll;

    course;

    activeTab = 'description';

    constructor() {
        super('app-course', template);
    }

    onUpdate() {
        if (this.course) {
            MdlService
                .upgradeOne(`${this.selector} .mdl-tabs`)
                .upgradeAll(`${this.selector} .mdl-tabs__ripple-container`);
            this.#onScroll = ScrollService.add(`${this.selector} .mdl-tabs__tab-bar`, 16);
        } else if (!this.components.length) {
            this.#show(decodeURI(RouterComponent.get('course')));
        }
    }

    onDestroy() {
        if (this.course && this.course.readme) {
            ScrollService.remove(this.#onScroll);
            this.course = null;
        }
        this.components.forEach((component) => this.detach(component));
    }

    onTab(tab) {
        this.activeTab = tab;
    }

    onSummary(id) {
        const className = 'open';
        const summary = window.document.querySelector(`${this.selector} .summary-${id}`);
        const btn = window.document.querySelector(`${this.selector} .summary-${id} .toggle`);
        if (summary.classList.contains(className)) {
            summary.classList.remove(className);
            btn.innerText = 'keyboard_arrow_down';
        } else {
            summary.classList.add(className);
            btn.innerText = 'keyboard_arrow_up';
        }
    }

    onChapter(wikiIndex, sectionIndex) {
        RouterComponent.navigate('chapter', {
            course: RouterComponent.get('course'),
            chapter: this.course.wikiList[wikiIndex].document.querySelector('h1').innerText,
            section: this.course.wikiList[wikiIndex].document.querySelectorAll('h2')[sectionIndex].innerText.substring(3),
        });
    }

    async #show(courseName) {
        const [spinner, retry] = SpinnerService.start(this, () => this.#show(courseName));
        try {
            this.course = await CourseService.fetch(courseName);
            this.percent = CourseService.toPercent(this.course);
            this.detach(spinner);
        } catch (error) {
            if (error instanceof NotFoundError) {
                RouterComponent.navigate('courses');
            } else if (!(error instanceof AbortError)) {
                this.attach(retry);
            }
        } finally {
            this.update();
        }
    }

}
