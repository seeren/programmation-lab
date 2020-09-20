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
         * @type {XMLHttpRequest}
         */
        this.xhr = null;

        /**
         * @type {Array<Course>}
         */
        this.courseList = [];

        /**
         * @type {Object}
         */
        this.colorList = {
            a: 'blue-500',
            b: 'purple-500',
            c: 'blue-grey-800',
            d: 'grey-800',
            e: 'red-600',
            f: 'blue-500',
            g: 'grey-600',
            h: 'deep-orange-500',
            i: 'blue-500',
            j: 'yellow-700',
            k: 'grey-800',
            l: 'pink-500',
            m: 'lime-500',
            n: 'green-500',
            o: 'amber-500',
            p: 'deep-purple-500',
            q: 'brown-500',
            r: 'red',
            s: 'light-blue-500',
            t: 'indigo-500',
            u: 'pink-500',
            v: 'teal-500',
            w: 'red-600',
            x: 'light-green-500',
            y: 'deep-orange-500',
            z: 'cyan-500',
        };
    }

    /**
     * @param {Array<any>} dataList
     * @returns {Array<Course>}
     */
    build(dataList) {
        this.courseList.splice(0, this.courseList.length);
        dataList.forEach((data) => {
            const course = new Course();
            const date = data.updated_at.substr(0, data.updated_at.indexOf('T')).split('-');
            course.description = data.description;
            course.name = data.name;
            course.color = this.colorList[course.name[0].toLowerCase()];
            course.stargazers = data.stargazers_count;
            course.updated = `${date[2]}/${date[1]}/${date[0]}`;
            course.watchers = data.watchers_count;
            course.wikiList = [];
            this.courseList.push(course);
        });
        return this.courseList.sort((a, b) => (new Date(b.updated))
            .valueOf() - (new Date(a.updated))
            .valueOf());
    }

    /**
     * @returns {Promise<Array<Course>|Error>}
     */
    fetch() {
        return new Promise((resolve, reject) => {
            this.xhr = new XMLHttpRequest();
            this.xhr.open('GET', `https://api.github.com/users/${environment.organisation}/repos`);
            this.xhr.onload = () => resolve(this.build(JSON.parse(this.xhr.response)));
            this.xhr.onerror = (e) => reject(e);
            this.xhr.send();
        });
    }

}();
