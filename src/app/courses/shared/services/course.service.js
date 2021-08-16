import { StateService, Service } from 'appable';

import { environment } from '../../../../../environment/environment.prod';

import { ChapterService } from '../../chapter/chapter.service';
import { CourseListService } from '../../course-list/couse-list.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

export const CourseService = new class extends Service {

    #course = LocalStorageService.get(environment.storage.course);

    constructor() {
        super();
        ChapterService.attach(() => {
            this.#course = CourseListService.courseList
                .find((course) => StateService.get().param.course === course.name);
            LocalStorageService.set(environment.storage.course, this.#course, 86400 * 365);
        });
    }

    get() {
        return this.#course;
    }

    set(course) {
        this.#course = course;
    }

}();
