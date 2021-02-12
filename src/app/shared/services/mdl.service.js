import { Service } from 'appable';

/**
 * @type {MdlService}
 */
// @ts-ignore
export const MdlService = new class extends Service {

    /**
     * @returns {void}
     */
    upgrade() {
        return global.componentHandler.upgradeDom();
    }

    /**
     * @param {String} selector
     * @returns {this}
     */
    upgradeOne(selector) {
        global.componentHandler.upgradeElement(document.querySelector(selector));
        return this;
    }

    /**
     * @param {String} selector
     * @returns {this}
     */
    upgradeAll(selector) {
        global.componentHandler.upgradeElements(document.querySelectorAll(selector));
        return this;
    }

    /**
     * @param {String} selector
     * @returns {this}
     */
    downGrade(selector) {
        global.componentHandler.downgradeElements(document.querySelector(selector));
        return this;
    }

}();
