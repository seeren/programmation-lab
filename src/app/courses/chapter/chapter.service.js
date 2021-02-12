import { Service } from 'appable';

import { NotFoundError } from '../../shared/errors/not-found.error';
import { CourseListService } from '../course-list/couse-list.service';
import { Course } from '../course/cours.model';
import { CourseService } from '../course/course.service';
import { Wiki } from '../shared/models/wiki.model';

/**
 * @type {ChapterService}
 */
// @ts-ignore
export const ChapterService = new class extends Service {

    /**
     * @param {String} name
     * @param {String} chapter
     * @returns {Promise<Wiki>}
     */
    get(name, chapter) {
        return new Promise((resolve, reject) => {
            CourseService.get(name)
                .then(

                    /**
                     * @param {Course} course
                     */
                    (course) => {
                        const wiki = course.wikiList.find(
                            (readme) => chapter === readme.document.querySelector('h1').innerText,
                        );
                        return wiki ? resolve(wiki) : reject(new NotFoundError());
                    },
                )
                .catch(

                    /**
                     * @param {Error} error
                     */
                    (error) => reject(error),
                );
        });
    }

    /**
     * @param {Wiki} wiki
     */
    terminate(wiki) {
        wiki.checked = true;
        CourseListService.save();
    }

}();
