import { HttpClientService } from '../../shared/services/http-client.service';
import { environment } from '../../../../environment/environment.prod';
import { NotFoundError } from '../../shared/errors/not-found.error';
import { RateError } from '../../shared/errors/rate.error';
import { CourseListService } from '../course-list/couse-list.service';
import { WikiListService } from '../shared/services/wiki-list.service';
import { CourseBuilder } from './course.builder';
import { Course } from './cours.model';

/**
 * @type {CourseService}
 */
// @ts-ignore
export const CourseService = new class extends HttpClientService {

    constructor() {
        super();

        /**
         * @type {CourseBuilder}
         */
        this.builder = new CourseBuilder();
    }

    /**
     * @param {String} name
     * @returns {Promise<Course>}
     */
    get(name) {
        return new Promise((resolve, reject) => {
            const course = CourseListService.courseList.find((item) => item.name === name);
            if (course && course.readme && course.wikiList) {
                if (!(course.readme.document instanceof DocumentFragment)) {
                    this.builder.decorate(course);
                }
                return resolve(course);
            }
            this.request(reject);
            this.xhr.open('GET', `https://api.github.com/repos/${environment.organisation}/${name}/readme`);
            this.xhr.setRequestHeader('Authorization', `token ${environment.token}`);
            this.xhr.onload = () => this.onload(resolve, reject, name);
            this.xhr.send();
        });
    }

    /**
     * @param {Function} resolve
     * @param {Function} reject
     * @param {String} name
     */
    onload(resolve, reject, name) {
        const readme = JSON.parse(this.xhr.response);
        if (404 === this.xhr.status) {
            return reject(new NotFoundError(`Repo "${environment.organisation}/${name}" not found`));
        }
        if (!readme.content) {
            return reject(new RateError());
        }
        const course = this.builder.build(CourseListService.courseList, readme, name);
        WikiListService.get(name).then((wikiList) => {
            course.wikiList = wikiList;
            CourseListService.save();
            this.builder.decorate(course);
            resolve(course);
        }).catch((e) => reject(e));
    }

    /**
     * @returns {Boolean}
     */
    abort() {
        super.abort();
        return WikiListService.abort();
    }

}();
