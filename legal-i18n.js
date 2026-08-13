/* =============================================
   legal-i18n.js — motore di traduzione delle pagine legali

   Condiviso da privacy.html e terms.html. Ogni pagina fornisce il proprio
   dizionario in window.LEGAL_TRANSLATIONS prima di chiamare initLegalI18n().

   Stesse regole della landing: ogni chiave deve esistere in tutte e quattro
   le lingue, e il testo tradotto viene inserito con textContent salvo che la
   chiave sia dichiarata fra quelle con markup, così una traduzione non può
   iniettare HTML nella pagina.
   ============================================= */

(function (global) {
    'use strict';

    var HTML_LANG = { it: 'it', en: 'en', ru: 'ru', cn: 'zh-CN' };
    var STORAGE_KEY = 'replymind-lang';

    function applyLegalLanguage(lang, dict, htmlKeys) {
        var t = dict[lang];
        if (!t) return;

        Object.keys(t).forEach(function (key) {
            if (key === 'pageTitle' || key === 'pageDesc') return;
            var el = document.getElementById(key);
            if (!el) return;
            if (htmlKeys && htmlKeys[key]) el.innerHTML = t[key];
            else el.textContent = t[key];
        });

        if (t.pageTitle) {
            document.title = t.pageTitle;
            var titleEl = document.getElementById('pageTitle');
            if (titleEl) titleEl.textContent = t.pageTitle;
        }
        if (t.pageDesc) {
            var desc = document.getElementById('pageDesc');
            if (desc) desc.content = t.pageDesc;
        }

        document.getElementById('htmlRoot').lang = HTML_LANG[lang] || 'en';

        Array.prototype.forEach.call(document.querySelectorAll('.lang-btn'), function (btn) {
            var on = btn.dataset.lang === lang;
            btn.classList.toggle('active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }

    /**
     * Lingua iniziale: scelta salvata (condivisa con la landing), poi lingua
     * del browser rispettandone l'ordine di preferenza, infine inglese.
     */
    function detectLang(dict) {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        if (saved && dict[saved]) return saved;

        var candidates = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language || ''];
        var map = { it: 'it', en: 'en', ru: 'ru', zh: 'cn' };
        for (var i = 0; i < candidates.length; i++) {
            var code = String(candidates[i]).toLowerCase().split('-')[0];
            if (map[code] && dict[map[code]]) return map[code];
        }
        return 'en';
    }

    /**
     * @param {object} dict Dizionario per lingua ({it:{...}, en:{...}, ...}).
     * @param {object} [htmlKeys] Chiavi il cui testo contiene markup HTML.
     * @param {(lang: string, texts: object) => void} [onChange] Chiamata a ogni
     *   cambio lingua (incluso quello iniziale) con la lingua attiva e il suo
     *   dizionario: serve ai chiamanti che devono comporre messaggi dinamici
     *   (stato di un polling, errori) senza ripetere qui la rilevazione lingua.
     */
    global.initLegalI18n = function (dict, htmlKeys, onChange) {
        Array.prototype.forEach.call(document.querySelectorAll('.lang-btn'), function (btn) {
            btn.addEventListener('click', function () {
                var lang = this.dataset.lang;
                applyLegalLanguage(lang, dict, htmlKeys);
                if (onChange) onChange(lang, dict[lang]);
            });
        });
        var initial = detectLang(dict);
        applyLegalLanguage(initial, dict, htmlKeys);
        if (onChange) onChange(initial, dict[initial]);
    };
})(window);
