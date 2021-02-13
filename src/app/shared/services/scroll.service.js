import { Service } from 'appable';

/**
 * @type {ScrollService}
 */
// @ts-ignore
export const ScrollService = new class extends Service {

    top() {
        window.document.querySelector('main.mdl-layout__content').scrollTo({
            left: 0,
            top: 0,
        });
    }

    /**
     * @param {EventListenerOrEventListenerObject} onScroll
     */
    remove(onScroll) {
        window.document.querySelector('main.mdl-layout__content')
            .removeEventListener('scroll', onScroll);
    }

    /**
     * @param {String} selector
     * @param {Number} offsetTop
     * @returns {EventListenerOrEventListenerObject}
     */
    add(selector, offsetTop) {

        /**
         * @param {Event} event
         */
        const onScroll = (event) => this.listen(
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
     * @param {HTMLElement} container
     * @param {HTMLElement} subject
     * @param {Number} offsetTop
     */
    listen(container, subject, offsetTop) {
        if (!subject.getAttribute('data-scrolled')) {
            window.requestAnimationFrame(() => {
                const scrolled = subject.classList.contains('scrolled');
                if (!scrolled && offsetTop < container.scrollTop) {
                    subject.classList.add('scrolled');
                } else if (scrolled && offsetTop >= container.scrollTop) {
                    subject.classList.remove('scrolled');
                }
                subject.removeAttribute('data-scrolled');
            });
            subject.setAttribute('data-scrolled', 'scrolled');
        }
    }

}();
