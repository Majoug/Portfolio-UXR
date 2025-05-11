import { Signal } from './signal.mjs';

export class I18n {
    static #instance = null;
    static #supportedLocales = ['fr', 'en', 'es'];
    static #LOCALE_STORAGE_KEY = 'userPreferredLocale';

    #readLocale;
    #writeLocale;
    #readTranslations;
    #writeTranslations;

    constructor() {
        if (I18n.#instance) {
            return I18n.#instance;
        }

        const initialLocale = this.#determineInitialLocale();
        [this.#readLocale, this.#writeLocale] = Signal.sg(initialLocale);
        [this.#readTranslations, this.#writeTranslations] = Signal.sg({});

        this.#loadTranslations(this.#readLocale());
        I18n.#instance = this;
    }

    t(key) {
        const translations = this.#readTranslations();
        const value = key.split('.').reduce((obj, prop) => {
            return obj ? obj[prop] : null;
        }, translations);

        return value;
    }

    get currentLocale() {
        return this.#readLocale();
    }

    async setLocale(newLocale) {
        this.#writeLocale(newLocale);
        this.#setStoredLocale(newLocale);
        await this.#loadTranslations(newLocale);
        document.querySelector('html').setAttribute('lang', newLocale);
    }

    #getStoredLocale() {
        return localStorage.getItem(I18n.#LOCALE_STORAGE_KEY);
    }

    #setStoredLocale(locale) {
        localStorage.setItem(I18n.#LOCALE_STORAGE_KEY, locale);
    }

    #determineInitialLocale() {
        const stored = this.#getStoredLocale();
        if (stored && I18n.#supportedLocales.includes(stored)) {
            return stored;
        }

        const userLocales = navigator.languages;
        const foundLocale = userLocales.find(locale => {
            const baseLocale = locale.split('-')[0].toLowerCase();
            return I18n.#supportedLocales.includes(baseLocale);
        });

        if (foundLocale) {
            return foundLocale.split('-')[0].toLowerCase();
        }

        return 'en';
    }

    async #loadTranslations(locale) {
        const translationPath = `/public/i18n/${locale}.json`;
        const response = await fetch(translationPath);
        const loadedTranslations = await response.json();
        this.#writeTranslations(loadedTranslations);
    }
}