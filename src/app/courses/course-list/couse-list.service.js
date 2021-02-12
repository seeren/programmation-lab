import { environment } from '../../../../environment/environment.prod';

import { HttpClientService } from '../../shared/services/http-client.service';
import { RateError } from '../../shared/errors/rate.error';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Course } from '../course/cours.model';
import { CourseListBuilder } from './course-list.builder';

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
        this.courseList = LocalStorageService.get(environment.storage) || [];

        /**
         * @type {CourseListBuilder}
         */
        this.builder = new CourseListBuilder();
    }

    /**
     * @returns {Promise<Array<Course>>}
     */
    get() {
        return new Promise((resolve, reject) => {
            if (this.courseList.length && !this.courseList.find((course) => !course.description)) {
                return resolve(this.courseList);
            }
            this.request(reject);
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.setRequestHeader('Authorization', `token ${environment.token}`);
            this.xhr.onload = () => {
                const repositoryList = JSON.parse(this.xhr.response);
                if (!Array.isArray(repositoryList)) {
                    return reject(new RateError());
                }
                this.courseList = this.builder.build(repositoryList, this.courseList);
                this.save();
                return resolve(this.courseList);
            };
            this.xhr.send();
        });
    }

    /**
     * @returns {void}
     */
    save() {
        LocalStorageService.set(environment.storage, this.courseList, 86400);
    }

}();
