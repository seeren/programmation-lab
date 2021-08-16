import { Service } from 'appable';

export const MdlService = new class extends Service {

    #componentHandler = global.componentHandler;

    upgrade() {
        this.#componentHandler.upgradeDom();
        return this;
    }

    upgradeOne(selector) {
        this.#componentHandler.upgradeElement(document.querySelector(selector));
        return this;
    }

    upgradeAll(selector) {
        this.#componentHandler.upgradeElements(document.querySelectorAll(selector));
        return this;
    }

    downGrade(selector) {
        this.#componentHandler.downgradeElements(document.querySelector(selector));
        return this;
    }

}();
