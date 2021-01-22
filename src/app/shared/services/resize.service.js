import { Component, Service } from 'appable';

/**
 * @type {ResizeService}
 */
// @ts-ignore
export const ResizeService = new class extends Service {

    /**
     * @param {Component} component
     * @param {HTMLElement} element
     * @returns {EventListenerOrEventListenerObject}
     */
    add(component, element) {
        const onResize = () => {
            component[`${'onDestroy'}`]();
            component[`${'onUpdate'}`](element);
        };
        window.addEventListener('resize', onResize);
        return onResize;
    }

    /**
     * @param {EventListenerOrEventListenerObject} onResize
     */
    remove(onResize) {
        window.removeEventListener('resize', onResize);
    }

}();
