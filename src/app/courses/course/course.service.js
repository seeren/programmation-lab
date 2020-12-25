import { environment } from '../../../../environment/environment';

import { NotFoundError } from '../../shared/errors/not-found.error';
import { RateError } from '../../shared/errors/rate.error';
import { HttpClientService } from '../../shared/services/http-client.service';
import { CourseBuilder } from './course.builder';
import { Course } from './cours.model';
import { CourseListService } from '../course-list/couse-list.service';
import { WikiListService } from '../shared/services/wiki-list.service';

/**
 * @type {CourseService}
 */
// @ts-ignore
export const CourseService = new class extends HttpClientService {

    /**
     * @param {String} name
     * @returns {Promise<Course>}
     */
    get(name) {
        return new Promise((resolve, reject) => {
            this.xhr = this.request(reject);
            this.xhr.open('GET', `https://api.github.com/repos/${environment.organisation}/${name}/readme`);
            this.xhr.setRequestHeader('Authorization', `token ${environment.token}`);
            this.xhr.onload = () => {
                const readme = JSON.parse(this.xhr.response);
                if (404 === this.xhr.status) {
                    return reject(new NotFoundError(`Repo "${environment.organisation}/${name}" not found`));
                } if (!readme.content) {
                    return reject(new RateError());
                }
                const builder = new CourseBuilder();
                const course = builder.build(CourseListService.courseList, readme, name);
                // WikiListService.get(name)
                //     .then((wikiList) => {
                //         course.wikiList = wikiList;
                //         resolve(course);
                //     })
                //     .catch((e) => reject(e));
                resolve(course);
            };
            this.xhr.send();
        });
    }

}();
