import { I18n } from './i18n.mjs';

function initializeLanguageSelector() {
    const selectElement = document.getElementById('language-select');

    const i18n = new I18n();
    selectElement.value = i18n.currentLocale;
    selectElement.addEventListener('change', (event) => {
        i18n.setLocale(event.target.value);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguageSelector);
} else {
    initializeLanguageSelector();
}