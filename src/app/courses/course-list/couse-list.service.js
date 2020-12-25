import { environment } from '../../../../environment/environment.prod';
import { RateError } from '../../shared/errors/rate.error';

import { HttpClientService } from '../../shared/services/http-client.service';
import { CourseListBuilder } from './course-list.builder';
import { Course } from '../course/cours.model';

/**
 * @type {CourseListService}
 */
// @ts-ignore
export const CourseListService = new class extends HttpClientService {

    /**
     * @constructor
     */
    constructor() {
        super();

        /**
         * @type {Array<Course>}
         */
        this.courseList = [];
    }

    /**
     * @returns {Promise<Array<Course>>}
     */
    get() {
        return new Promise((resolve, reject) => {
            this.xhr = this.request(reject);
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.setRequestHeader('Authorization', `token ${environment.token}`);
            this.xhr.onload = () => {
                const builder = new CourseListBuilder();
                const repositoryList = JSON.parse(this.xhr.response);
                return Array.isArray(repositoryList)
                    ? resolve(builder.build(this.courseList, repositoryList))
                    : reject(new RateError());
            };
            this.xhr.send();
        });
    }

}();
