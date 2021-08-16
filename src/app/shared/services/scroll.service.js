import { Service } from 'appable';

export const ScrollService = new class extends Service {

    #listen(container, subject, offsetTop) {
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

    top() {
        window.document.querySelector('main.mdl-layout__content').scrollTo({ left: 0, top: 0 });
    }

    remove(onScroll) {
        window.document.querySelector('main.mdl-layout__content').removeEventListener('scroll', onScroll);
    }

    add(selector, offsetTop) {
        const onScroll = (event) => {
            this.#listen(event.target, window.document.querySelector(selector), offsetTop);
        };
        window.document.querySelector('main.mdl-layout__content').addEventListener('scroll', onScroll);
        return onScroll;
    }

}();
