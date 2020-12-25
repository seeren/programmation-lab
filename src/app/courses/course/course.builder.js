import { Course } from './cours.model';
import { ReadmeBuilder } from '../shared/builders/readme.builder';

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
        course.readme = new ReadmeBuilder().build(decodeURIComponent(escape(atob(readme.content))));
        return course;
    }

}
