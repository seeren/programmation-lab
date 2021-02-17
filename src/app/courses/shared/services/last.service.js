import { RouterService, Service } from 'appable';

import { environment } from '../../../../../environment/environment.prod';

import { ChapterService } from '../../chapter/chapter.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { Last } from '../models/last.model';
import { CourseListService } from '../../course-list/couse-list.service';
import { Course } from '../../course/cours.model';

/**
 * @type {LastService}
 */
// @ts-ignore
export const LastService = new class extends Service {

    constructor() {
        super();

        /**
         * @type {Last}
         */
        this.last = LocalStorageService.get(environment.storage.last) || null;

        ChapterService.attach(() => {
            this.last = new Last();
            const course = CourseListService.courseList.find(

                /**
                 * @param {Course} item
                 */
                (item) => RouterService.get()[`${'param'}`].course === item.name,
            );
            this.last.name = course.name;
            this.last.description = course.description;
            this.last.color = course.color;
            this.last.updated = new Intl.DateTimeFormat('fr-FR').format(new Date());
            LocalStorageService.set(environment.storage.last, this.last, 86400 * 365);
        });
    }

}();
