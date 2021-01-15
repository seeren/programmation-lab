import { environment } from '../../../../environment/environment.prod';
import { RateError } from '../../shared/errors/rate.error';
import { HttpClientService } from '../../shared/services/http-client.service';
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
         * @type {String}
         */
        this.key = `${environment.organisation}:course-list`;

        /**
         * @type {Array<Course>}
         */
        this.courseList = LocalStorageService.get(this.key) || [];
    }

    /**
     * @returns {Promise<Array<Course>>}
     */
    get() {
        return new Promise((resolve, reject) => {
            if (this.courseList.length) {
                return resolve(this.courseList);
            }
            this.xhr = this.request(reject);
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.setRequestHeader('Authorization', `token ${environment.token}`);
            this.xhr.onload = () => {
                const repositoryList = JSON.parse(this.xhr.response);
                if (!Array.isArray(repositoryList)) {
                    return reject(new RateError());
                }
                new CourseListBuilder().build(this.courseList, repositoryList);
                this.save();
                resolve(this.courseList);
            };
            this.xhr.send();
        });
    }

    /**
     * @returns {void}
     */
    save() {
        LocalStorageService.set(this.key, this.courseList, 86400);
    }

}();
