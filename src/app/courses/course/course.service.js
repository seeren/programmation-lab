import { environment } from '../../../../environment/environment.prod';

import { HttpClientService } from '../../shared/services/http-client.service';
import { NotFoundError } from '../../shared/errors/not-found.error';
import { RateError } from '../../shared/errors/rate.error';
import { CourseListService } from '../course-list/couse-list.service';
import { WikiListService } from '../shared/services/wiki-list.service';
import { CourseBuilder } from './course.builder';
import { AbortService } from '../../shared/services/abort.service';
import { AbortError } from '../../shared/errors/abort.error';
import { NetworkError } from '../../shared/errors/network.error';

export const CourseService = new class extends HttpClientService {

    async fetch(courseName) {
        let readme;
        const builder = new CourseBuilder();
        const saved = CourseListService.courseList.find((item) => item.name === courseName);
        if (saved && saved.readme && saved.wikiList) {
            if (!(saved.readme.document instanceof DocumentFragment)) {
                builder.decorate(saved);
            }
            return saved;
        }
        try {
            AbortService.add(CourseService);
            readme = await (fetch(`https://api.github.com/repos/${environment.organisation}/${courseName}/readme`, {
                signal: this.controller.signal,
                headers: { Authorization: `token ${environment.token}` },
            }).then((response) => response.json()));
        } catch (error) {
            throw error instanceof DOMException ? new AbortError() : new NetworkError();
        }
        if ('Not Found' === readme.message) {
            throw new NotFoundError(`Repo "${environment.organisation}/${courseName}" not found`);
        } else if (!readme.content) {
            throw new RateError();
        }
        const course = builder.build(CourseListService.courseList, readme, courseName);
        course.wikiList = await WikiListService.fetch(courseName);
        CourseListService.save();
        builder.decorate(course);
        return course;
    }

    toPercent(course) {
        let checked = 0;
        course.wikiList.forEach((wiki) => checked += wiki.checked ? 1 : 0);
        return Math.round((checked / (course.wikiList.length - 1)) * 100);
    }

}();
