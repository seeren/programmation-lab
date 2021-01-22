import { Service } from 'appable';

/**
 * @type {ScrollService}
 */
// @ts-ignore
export const ScrollService = new class extends Service {

    /**
     * @param {String} selector
     * @param {Number} offsetTop
     * @returns {EventListenerOrEventListenerObject}
     */
    add(selector, offsetTop) {

        /**
         * @param {Event} event
         */
        const onScroll = (event) => this.scroll(
            // @ts-ignore
            event.target,
            window.document.querySelector(selector),
            offsetTop,
        );
        window.document
            .querySelector('main.mdl-layout__content')
            .addEventListener('scroll', onScroll);
        return onScroll;
    }

    /**
     * @param {EventListenerOrEventListenerObject} onScroll
     */
    remove(onScroll) {
        window.document.querySelector('main.mdl-layout__content')
            .removeEventListener('scroll', onScroll);
    }

    /**
     * @param {HTMLElement} container
     * @param {HTMLElement} subject
     * @param {Number} offsetTop
     */
    scroll(container, subject, offsetTop) {
        // @ts-ignore
        if (!subject.getAttribute('data-sticky')) {
            window.requestAnimationFrame(() => {
                const scrolled = subject.classList.contains('sticky');
                if (!scrolled && offsetTop < container.scrollTop) {
                    subject.classList.add('sticky');
                } else if (scrolled && offsetTop >= container.scrollTop) {
                    subject.classList.remove('sticky');
                }
                // @ts-ignore
                subject.removeAttribute('data-sticky');
            });
            subject.setAttribute('data-sticky', 'sticky');
        }
    }

}();
