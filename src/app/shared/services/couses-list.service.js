import { Service } from 'appable';

import { environment } from '../../../../environment/environment';

import { AbortError } from '../errors/abort.error';
import { CourseListBuilder } from '../builders/course-list.builder';
import { Course } from '../models/cours.model';

/**
 * @type {CousesListService}
 */
// @ts-ignore
export const CousesListService = new class extends Service {

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

        /**
         * @type {CourseListBuilder}
         */
        this.builder = new CourseListBuilder();
    }

    /**
     * @returns {Promise<Array<Course>|Error>}
     */
    fetch() {
        this.xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.onload = () => {
                this.courseList = this.builder.build(JSON.parse(this.xhr.response));
                resolve(this.courseList);
            };
            this.xhr.onerror = (e) => reject(e);
            this.xhr.onabort = () => reject(new AbortError());
            this.xhr.send();
        });
    }

}();
