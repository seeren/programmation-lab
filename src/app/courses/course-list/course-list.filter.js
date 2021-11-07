export class CourseListFilter {

    static DATE = 1;

    static NAME = 2;

    static STARS = 3;

    filter(courseList, type = CourseListFilter.DATE) {
        switch (type) {
        case CourseListFilter.NAME:
            return courseList.sort((a, b) => a.name > b.name);
        case CourseListFilter.STARS:
            return courseList.sort((a, b) => a.stargazers < b.stargazers);
        default:
            return courseList.sort(
                (a, b) => (new Date(b.updated)).valueOf() - (new Date(a.updated)).valueOf(),
            );
        }
    }

}
