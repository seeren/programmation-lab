import { Course } from './cours.model';
import { Markdown } from '../shared/models/markdown.model';
import { MarkdownHTML } from '../shared/converters/markdown-html.converter';
import { ColorService } from '../shared/services/color.service';

export class CourseBuilder {

    build(courseList, readme, name) {
        let course = courseList.find((item) => item.name === name);
        if (!course) {
            course = new Course();
            courseList.push(course);
            [,,,, course.name] = readme.html_url.split('/');
            course.color = ColorService.get(course.name);
        }
        course.readme = new Markdown();
        course.readme.raw = decodeURIComponent(escape(atob(readme.content)));
        course.readme.checked = true;
        return course;
    }

    decorate(course) {
        const converter = new MarkdownHTML();
        course.readme.document = converter.convert(course.readme.raw);
        course.wikiList.forEach((wikiList) => wikiList.document = converter.convert(wikiList.raw));
        return course;
    }

}
