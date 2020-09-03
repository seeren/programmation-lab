import { Service } from 'appable';

import { environment } from '../../../../environment/environment';

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
         * @type {Array<Course>}
         */
        this.courseList = [];

        /**
         * @type {XMLHttpRequest}
         */
        this.xhr = null;
    }

    /**
     * @param {Array<any>} dataList
     * @returns {Array<Course>}
     */
    build(dataList) {
        this.courseList.splice(0, this.courseList.length);
        dataList.forEach((data) => {
            const course = new Course();
            course.description = data.description;
            course.name = data.name;
            course.stargazers = data.stargazers_count;
            course.updated = data.updated_at;
            course.watchers = data.watchers_count;
            course.wikiList = [];
            this.courseList.push(course);
        });
        return this.courseList;
    }

    /**
     * @returns {Promise<Array<Course>|Error>}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.xhr = new XMLHttpRequest();
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.onload = () => {
                resolve(this.build(JSON.parse(this.xhr.response)));
            };
            this.xhr.onerror = (e) => {
                reject(e);
            };
            this.xhr.send();
        });
    }

}();
