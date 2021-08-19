import { Service } from 'appable';

import { NotFoundError } from '../../shared/errors/not-found.error';
import { CourseListService } from '../course-list/couse-list.service';
import { CourseService } from '../course/course.service';

export const ChapterService = new class extends Service {

    async fetch(courseName, chapterName) {
        const course = await CourseService.fetch(courseName);
        const wiki = course.wikiList.find((readme) => chapterName === readme.document.querySelector('h1').innerText);
        if (!wiki) {
            throw new NotFoundError();
        }
        return wiki;
    }

    terminate(wiki) {
        wiki.checked = true;
        CourseListService.save();
    }

}();
