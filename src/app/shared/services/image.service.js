import { Service } from 'appable';

export const ImageService = new class extends Service {

    lazyLoad(loaders) {
        window.document.querySelectorAll(loaders).forEach((loader) => {
            const image = new Image();
            image.onload = () => loader.parentNode.replaceChild(image, loader);
            image.src = loader.getAttribute('data-src');
        });
    }

}();
