import { Service } from 'appable';

/**
 * @type {StickyEventService}
 */
// @ts-ignore
export const StickyEventService = new class extends Service {

    /**
     * @param {HTMLElement} container
     * @param {HTMLElement} subject
     * @param {Number} offsetTop
     */
    onscroll(container, subject, offsetTop) {
        // @ts-ignore
        if (!subject.sticky) {
            window.requestAnimationFrame(() => {
                const scrolled = subject.classList.contains('sticky');
                if (!scrolled && offsetTop < container.scrollTop) {
                    subject.classList.add('sticky');
                } else if (scrolled && offsetTop >= container.scrollTop) {
                    subject.classList.remove('sticky');
                }
                // @ts-ignore
                delete subject.sticky;
            });
            // @ts-ignore
            subject.sticky = true;
        }
    }

}();
