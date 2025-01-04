import enUS from '../i18n/en-US.js';
import viVN from '../i18n/vi-VN.js';

window.i18n = {
    'en-US': enUS,
    'vi-VN': viVN
};

window.currentLanguage = localStorage.getItem('language') || 'en-US';

window.updatePageLanguage = function() {
    const texts = window.i18n[window.currentLanguage];
    
    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const keys = key.split('.');
        let value = texts;
        for (const k of keys) {
            value = value[k];
        }
        if (value) element.textContent = value;
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const keys = key.split('.');
        let value = texts;
        for (const k of keys) {
            value = value[k];
        }
        if (value) element.placeholder = value;
    });

    // Update button states
    const buttonText = document.getElementById('buttonText');
    if (buttonText && buttonText.disabled) {
        buttonText.textContent = texts.form.capturing;
    }
};

window.initializeLanguage = function() {
    document.getElementById('languageSelect').value = window.currentLanguage;
    window.updatePageLanguage();
};

document.addEventListener('DOMContentLoaded', () => {
    window.initializeLanguage();
});