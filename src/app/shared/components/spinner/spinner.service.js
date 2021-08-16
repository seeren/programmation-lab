import { Service } from 'appable';

import { RetryComponent } from '../retry/retry.component';
import { SpinnerComponent } from './spinner.component';

export const SpinnerService = new class extends Service {

    start(component, callback) {
        const spinner = new SpinnerComponent();
        const retry = new RetryComponent();
        retry.onRetry = () => {
            component.detach(retry);
            callback();
        };
        component.attach(spinner);
        component.update();
        return [spinner, retry];
    }

}();
