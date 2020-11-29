import { Course } from '../models/cours.model';

export class CourseBuilder {

    /**
     * @param {Array<Course>} courseList
     * @param {any} repository
     * @param {String} name
     * @returns {Course}
     */
    build(courseList, repository, name) {
        let course = courseList.find((item) => item.name === name);
        if (!course) {
            course = new Course();
            courseList.push(course);
        }
        course.readme = atob(repository.content);
        return course;
    }

}
