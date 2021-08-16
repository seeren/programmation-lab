import { Service } from 'appable';

export const ResizeService = new class extends Service {

    add(component, element) {
        const onResize = () => {
            component.onDestroy();
            component.onUpdate(element);
        };
        window.addEventListener('resize', onResize);
        return onResize;
    }

    remove(onResize) {
        window.removeEventListener('resize', onResize);
    }

}();
