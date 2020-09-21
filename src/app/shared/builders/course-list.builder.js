import { Course } from '../models/cours.model';

export class CourseListBuilder {

    /**
     * @constructor
     */
    constructor() {

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
     * @param {Array<any>} repositoryList
     * @returns {Array<Course>}
     */
    build(repositoryList) {
        const courseList = [];
        repositoryList.forEach((repository) => {
            const course = new Course();
            const date = repository.updated_at.substr(0, repository.updated_at.indexOf('T')).split('-');
            course.description = repository.description;
            course.name = repository.name;
            course.color = this.colorList[course.name[0].toLowerCase()];
            course.stargazers = repository.stargazers_count;
            course.updated = `${date[2]}/${date[1]}/${date[0]}`;
            course.watchers = repository.watchers_count;
            course.wikiList = [];
            courseList.push(course);
        });
        return courseList.sort((a, b) => (new Date(b.updated))
            .valueOf() - (new Date(a.updated))
            .valueOf());
    }

}
