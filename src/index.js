import 'material-design-lite';

import { RouterComponent } from 'appable';

import { AppComponent } from './app/app.component';
import { MainComponent } from './app/main/main.component';
import { CourseListComponent } from './app/courses/course-list/course-list.component';
import { CourseComponent } from './app/courses/course/course.component';
import { FavoriteListComponent } from './app/favorites/favorite-list/favorite-list.component';
import { ChapterComponent } from './app/courses/chapter/chapter.component';

((main) => (window.cordova
    ? window.document.addEventListener('deviceready', main)
    : window.addEventListener('load', main))
)(() => RouterComponent
    .add('/', 'main', MainComponent)
    .add('/formations', 'courses', CourseListComponent)
    .add('/formations/:course', 'course', CourseComponent)
    .add('/formations/:course/:chapter/:section', 'chapter', ChapterComponent)
    .add('/favoris', 'favorites', FavoriteListComponent)
    .run(new AppComponent()));
