import { Course } from '../shared/models/cours.model';
import { ColorService } from '../shared/services/color.service';

export class CourseListBuilder {

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
        return courseList.sort(
            (a, b) => (new Date(b.updated)).valueOf() - (new Date(a.updated)).valueOf(),
        );
    }

}
