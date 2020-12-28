import { Course } from './cours.model';
import { Readme } from '../shared/models/readme.model';

/**
 * @type {CourseBuilder}
 */
export class CourseBuilder {

    /**
     * @param {Array<Course>} courseList
     * @param {any} readme
     * @param {String} name
     * @returns {Course}
     */
    build(courseList, readme, name) {
        let course = courseList.find((item) => item.name === name);
        if (!course) {
            course = new Course();
            courseList.push(course);
        }
        course.readme = new Readme();
        course.readme.raw = decodeURIComponent(escape(atob(readme.content)));
        return course;
    }

}
