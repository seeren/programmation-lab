import 'material-design-lite';

import { RouterComponent } from 'appable';

import { AppComponent } from './app/app.component';
import { MainComponent } from './app/main/main.component';
import { CourseListComponent } from './app/courses/course-list/course-list.component';
import { CourseComponent } from './app/courses/course/course.component';
import { FavoriteListComponent } from './app/favorites/favorite-list/favorite-list.component';

((run) => (window.cordova
    ? window.document.addEventListener('deviceready', run)
    : window.addEventListener('load', run))
)(() => RouterComponent
    .add('/formations', 'formations', CourseListComponent)
    .add('/formations/:name', 'formation', CourseComponent)
    .add('/seeren', 'seeren', MainComponent)
    .add('/favoris', 'favorites', FavoriteListComponent)
    .run(new AppComponent()));
