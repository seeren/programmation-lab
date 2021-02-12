import { Service } from 'appable';

/**
 * @type {ImageService}
 */
// @ts-ignore
export const ImageService = new class extends Service {

    /**
     * @param {String} loaders
     */
    lazyLoad(loaders) {
        window.document.querySelectorAll(loaders).forEach((loader) => {
            const image = new Image();
            image.onload = () => loader.parentNode.replaceChild(image, loader);
            image.src = loader.getAttribute('data-src');
        });
    }

}();
