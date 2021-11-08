export class CourseListFilter {

    static DATE = 1;

    static NAME = 2;

    static STARS = 3;

    filter(courseList, type = CourseListFilter.DATE) {
        switch (type) {
        case CourseListFilter.NAME:
            return courseList.sort((a, b) => {
                if (a.name === b.name) {
                    return 0;
                }
                return a.name > b.name ? 1 : -1;
            });
        case CourseListFilter.STARS:
            return courseList.sort((a, b) => {
                if (a.stargazers === b.stargazers) {
                    return 0;
                }
                return a.stargazers < b.stargazers ? 1 : -1;
            });
        default:
            return courseList.sort((a, b) => {
                const dateA = (new Date(a.updated)).valueOf();
                const dateB = (new Date(b.updated)).valueOf();
                if (dateB === dateA) {
                    return 0;
                }
                return dateB > dateA ? 1 : -1;
            });
        }
    }

}
