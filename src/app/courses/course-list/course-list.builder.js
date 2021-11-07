import { Course } from '../course/cours.model';
import { ColorService } from '../shared/services/color.service';
import { CourseListFilter } from './course-list.filter';

export class CourseListBuilder {

    #filter = new CourseListFilter()

    build(repositoryList, courseList) {
        repositoryList.forEach((repository) => {
            let course = courseList.find((item) => repository.name === item.name);
            if (!course) {
                course = new Course();
                course.name = repository.name;
                courseList.push(course);
            }
            course.description = repository.description;
            course.color = ColorService.get(course.name);
            course.stargazers = repository.stargazers_count;
            course.updated = repository.updated_at;
            course.watchers = repository.watchers_count;
        });
        return this.#filter.filter(courseList);
    }

}
