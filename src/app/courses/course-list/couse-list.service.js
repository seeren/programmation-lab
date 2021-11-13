import { environment } from '../../../../environment/environment.prod';

import { CourseListBuilder } from './course-list.builder';
import { RateError } from '../../shared/errors/rate.error';
import { NetworkError } from '../../shared/errors/network.error';
import { AbortError } from '../../shared/errors/abort.error';
import { AbortService } from '../../shared/services/abort.service';
import { HttpClientService } from '../../shared/services/http-client.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

export const CourseListService = new class extends HttpClientService {

    #courseList = LocalStorageService.get(environment.storage.courseList) || [];

    async fetch() {
        if (this.#courseList.length
             && !this.#courseList.find((course) => 'number' !== typeof course.stargazers)) {
            return this.#courseList;
        }
        let repositoryList;
        try {
            AbortService.add(CourseListService);
            repositoryList = await (fetch(`https://api.github.com/users/${environment.organisation}/repos?per_page=50`, {
                signal: this.controller.signal,
                headers: { Authorization: `token ${environment.token}` },
            }).then((response) => response.json()));
        } catch (error) {
            throw error instanceof DOMException ? new AbortError() : new NetworkError();
        }
        if (!Array.isArray(repositoryList)) {
            throw new RateError();
        }
        this.#courseList = new CourseListBuilder().build(repositoryList, this.#courseList);
        this.save();
        return this.#courseList;
    }

    get courseList() {
        return this.#courseList;
    }

    save() {
        LocalStorageService.set(environment.storage.courseList, this.#courseList, 86400);
    }

}();
