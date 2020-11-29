import { Service } from 'appable';

import { environment } from '../../../../../environment/environment';

import { AbortError } from '../../../shared/errors/abort.error';
import { NotFoundError } from '../../../shared/errors/not-found.error';
import { CourseListBuilder } from '../builders/course-list.builder';
import { CourseBuilder } from '../builders/course.builder';
import { Course } from '../models/cours.model';

/**
 * @type {CourseListService}
 */
// @ts-ignore
export const CourseListService = new class extends Service {

    /**
     * @constructor
     */
    constructor() {
        super();

        /**
         * @type {XMLHttpRequest}
         */
        this.xhr = null;

        /**
         * @type {Array<Course>}
         */
        this.courseList = [];

    }

    /**
     * @returns {Promise<Array<Course>|Error>}
     */
    get() {
        this.xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.onload = () => {
                const json = JSON.parse(this.xhr.response);
                return !Array.isArray(json)
                    ? reject(new Error('Api rate exceeded'))
                    : resolve(new CourseListBuilder().build(this.courseList, json));
            };
            this.xhr.onerror = (e) => reject(e);
            this.xhr.onabort = () => reject(new AbortError());
            this.xhr.send();
        });
    }

    /**
     * @param {String} name
     * @returns {Promise<Course|Error>}
     */
    getByName(name) {
        this.xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            this.xhr.open('GET', `https://api.github.com/repos/${environment.organisation}/${name}/readme`);
            this.xhr.onload = () => {
                const json = JSON.parse(this.xhr.response);
                if (404 === this.xhr.status) {
                    return reject(new NotFoundError(`Repo "${environment.organisation}/${name}" not found`));
                } if (!json.content) {
                    return reject(new Error('Api rate exceeded'));
                }
                resolve(new CourseBuilder().build(this.courseList, json, name));
            };
            this.xhr.onerror = (e) => reject(e);
            this.xhr.onabort = () => reject(new AbortError());
            this.xhr.send();
        });
    }

    /**
     * @returns {Boolean}
     */
    abort() {
        if (1 === this.xhr.readyState) {
            this.xhr.abort();
            return true;
        }
        return false;
    }

}();
