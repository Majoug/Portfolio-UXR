import { Signal } from './signal.mjs';
import { I18n } from './i18n.mjs';

export class MjI18n extends HTMLElement {
    #i18n = null;
    #disposeEffect = null;

    #readKey;
    #writeKey;

    constructor() {
        super();

        this.#i18n = new I18n();
        this.wrapper = document.createElement('span');
        this.appendChild(this.wrapper);

        const initialKey = this.getAttribute('key') || '';
        [this.#readKey, this.#writeKey] = Signal.sg(initialKey);
    }

    connectedCallback() {
        this.#disposeEffect = Signal.fx(() => this.getTranslation());
    }

    disconnectedCallback() {
        if (this.#disposeEffect) {
            this.#disposeEffect.dispose();
            this.#disposeEffect = null;
        }
    }

    static get observedAttributes() {
        return ['key'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#writeKey(newValue || '');
    }

    getTranslation() {
        const currentKey = this.#readKey();

        if (!currentKey) {
            this.wrapper.textContent = '';
            return;
        }

        const translation = this.#i18n.t(currentKey);
        this.wrapper.textContent = translation
            ? translation
            : ``;
    }
}

customElements.define('mj-i18n', MjI18n);
