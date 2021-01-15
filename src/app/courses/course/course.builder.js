import { Course } from './cours.model';
import { Readme } from '../shared/models/readme.model';
import { MarkdownHTML } from '../shared/converters/markdown-html.converter';

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

    /**
     * @param {Course} course
     */
    decorate(course) {
        course.readme.childNodes = new MarkdownHTML().convert(course.readme.raw);
        course.wikiList.forEach((wikiList) => {
            wikiList.childNodes = new MarkdownHTML().convert(wikiList.raw);
        });
    }

}
