/* =============================================
   register.js — registrazione trial gratuito e avvio checkout piani a pagamento

   Un'unica pagina copre due percorsi, selezionati dal parametro ?plan= nell'URL:
   - nessun ?plan → CTA "trial gratuito" della landing: registra e basta.
   - ?plan=monthly (o altra chiave di PLANS in backend/plans.js) → CTA di un
     piano a pagamento: dopo la verifica email chiama /api/create-order e
     porta l'utente dentro il bot Telegram, dove sceglie come pagare.

   Il pagamento vero e proprio non avviene mai qui: questa pagina si ferma
   alla creazione dell'ordine, coerente con l'architettura "tutti i pagamenti
   passano dal bot" (vedi backend/telegram-bot.js).
   ============================================= */

(function () {
    'use strict';

    // In sviluppo locale punta al backend sulla stessa macchina; in
    // produzione il dominio pubblico dell'API (vedi backend/.env.example,
    // PUBLIC_APP_URL) va servito da un dominio api.* separato dal sito statico.
    var API_BASE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
        ? 'http://localhost:3000'
        : 'https://replymind-api-production.up.railway.app';

    var STORAGE_KEY = 'replymind-register-state';
    var params = new URLSearchParams(location.search);
    var requestedPlan = params.get('plan');

    var els = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3trial: document.getElementById('step3trial'),
        step3pay: document.getElementById('step3pay'),
        name: document.getElementById('nameInput'),
        email: document.getElementById('emailInput'),
        errorMsg: document.getElementById('errorMsg'),
        registerBtn: document.getElementById('registerBtn'),
        sentEmail: document.getElementById('sentEmail'),
        spinner: document.getElementById('spinner'),
        verifyStatus: document.getElementById('verifyStatus'),
        checklistFree: document.getElementById('checklistFree'),
        checklistPaid: document.getElementById('checklistPaid'),
        s3pBtn: document.getElementById('s3pBtn'),
        spinnerPay: document.getElementById('spinnerPay')
    };

    function showStep(id) {
        ['step1', 'step2', 'step3trial', 'step3pay'].forEach(function (key) {
            els[key].classList.toggle('hidden', key !== id);
        });
    }

    function showError(text) {
        els.errorMsg.textContent = text;
        els.errorMsg.style.display = 'block';
    }
    function clearError() {
        els.errorMsg.style.display = 'none';
    }

    // Piano → badge label con prezzo per lingua
    var PLAN_INFO = {
        monthly:     { it: 'Plus Mensile · €19/mese',       en: 'Plus Monthly · €19/mo',      ru: 'Plus Месяц · €19/мес',   cn: 'Plus 月付 · €19/月' },
        quarterly:   { it: 'Plus Trimestrale · €49/trim.',  en: 'Plus Quarterly · €49/qtr',   ru: 'Plus Квартал · €49/кв',  cn: 'Plus 季付 · €49/季' },
        annual:      { it: 'Plus Annuale · €179/anno',      en: 'Plus Annual · €179/yr',       ru: 'Plus Год · €179/год',    cn: 'Plus 年付 · €179/年' },
        pro_monthly: { it: 'Pro Mensile · €79/mese',        en: 'Pro Monthly · €79/mo',        ru: 'Pro Месяц · €79/мес',    cn: 'Pro 月付 · €79/月' },
        pro_annual:  { it: 'Pro Annuale · €749/anno',       en: 'Pro Annual · €749/yr',        ru: 'Pro Год · €749/год',     cn: 'Pro 年付 · €749/年' }
    };

    // Popolato da register-i18n.js a ogni cambio lingua (vedi la chiamata a
    // initLegalI18n lì): i messaggi generati qui in JS (spinner, errori)
    // leggono da qui invece di ripetere la rilevazione della lingua.
    var activeTexts = {};
    var activeLang = 'it';

    function applyPaidPlanUI(lang, texts) {
        var info = PLAN_INFO[requestedPlan];
        var badge = document.getElementById('trialBadge');
        var sub = document.getElementById('s1Sub');
        if (badge && info) badge.textContent = '🚀 ' + (info[lang] || info.en);
        if (sub && texts) sub.textContent = texts.s1SubPaid || 'Procedi con il piano selezionato';
        if (els.registerBtn && !els.registerBtn.disabled) {
            els.registerBtn.textContent = texts.registerBtnPaid || 'Registrati e vai su Telegram →';
        }
    }

    window.onRegisterLangChange = function (lang, texts) {
        activeTexts = texts || {};
        activeLang = lang || 'it';
        if (requestedPlan) applyPaidPlanUI(lang, texts);
    };
    function t() { return activeTexts; }

    if (requestedPlan) {
        els.checklistFree.classList.add('hidden');
        els.checklistPaid.classList.remove('hidden');
    }

    els.registerBtn.addEventListener('click', function () {
        var email = els.email.value.trim();
        var name = els.name.value.trim();
        clearError();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showError(t().errInvalidEmail || 'Email non valida.');
            return;
        }

        els.registerBtn.disabled = true;
        els.registerBtn.textContent = t().registering || 'Registrazione in corso...';

        fetch(API_BASE + '/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, name: name })
        })
            .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
            .then(function (r) {
                if (!r.ok || !r.data.success) {
                    if (r.data && r.data.error) {
                        showError(r.data.error);
                    } else {
                        showError(t().errGeneric || 'Errore durante la registrazione.');
                    }
                    els.registerBtn.disabled = false;
                    els.registerBtn.textContent = requestedPlan
                        ? (t().registerBtnPaid || 'Registrati e vai su Telegram →')
                        : (t().registerBtn || '🎯 Inizia il Trial →');
                    return;
                }

                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify({
                        userId: r.data.user.id,
                        email: email,
                        plan: requestedPlan || null
                    }));
                } catch (e) {}

                els.sentEmail.textContent = email;
                showStep('step2');
                pollVerification(r.data.user.id);
            })
            .catch(function () {
                showError(t().errNetwork || 'Errore di connessione. Riprova.');
                els.registerBtn.disabled = false;
                els.registerBtn.textContent = requestedPlan
                    ? (t().registerBtnPaid || 'Registrati e vai su Telegram →')
                    : (t().registerBtn || '🎯 Inizia il Trial →');
            });
    });

    function pollVerification(userId) {
        els.spinner.style.display = 'block';
        els.verifyStatus.textContent = t().waiting || '⏳ In attesa di verifica email...';
        var attempts = 0;
        var maxAttempts = 30; // 30 * 3s = 90s: la durata media per aprire una mail

        var interval = setInterval(function () {
            attempts++;
            fetch(API_BASE + '/api/check-verification/' + userId)
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    if (data.verified) {
                        clearInterval(interval);
                        els.spinner.style.display = 'none';
                        els.verifyStatus.textContent = t().verified || '✅ Email verificata con successo!';
                        els.verifyStatus.style.color = '#10B981';
                        setTimeout(function () { onVerified(userId); }, 800);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(interval);
                        els.spinner.style.display = 'none';
                        els.verifyStatus.textContent = t().timeout || '⏰ Tempo scaduto. Non hai verificato l\'email: ricarica la pagina per riprovare.';
                        els.verifyStatus.style.color = '#EF4444';
                    } else {
                        els.verifyStatus.textContent = (t().waiting || '⏳ In attesa di verifica email...') + ' (' + attempts + '/' + maxAttempts + ')';
                    }
                })
                .catch(function () { /* un fallimento di rete isolato non deve interrompere il polling */ });
        }, 3000);
    }

    function onVerified(userId) {
        var state = null;
        try { state = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) {}
        var plan = requestedPlan || (state && state.plan);

        if (!plan) {
            showStep('step3trial');
            return;
        }

        showStep('step3pay');
        fetch(API_BASE + '/api/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, plan: plan, payment_method: 'telegram' })
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                els.spinnerPay.style.display = 'none';
                if (data.success && data.redirect_url) {
                    els.s3pBtn.href = data.redirect_url;
                    els.s3pBtn.classList.remove('hidden');
                    // Redirect automatico: il pulsante resta come fallback se il
                    // browser blocca il redirect immediato o l'utente lo perde.
                    location.href = data.redirect_url;
                } else {
                    els.verifyStatus = els.verifyStatus; // no-op, mantiene coerenza col resto del file
                    document.getElementById('s3pSub').textContent =
                        (data && data.error) || (t().errOrder || 'Errore nella creazione dell\'ordine. Riprova dal sito.');
                }
            })
            .catch(function () {
                els.spinnerPay.style.display = 'none';
                document.getElementById('s3pSub').textContent = t().errNetwork || 'Errore di connessione. Riprova dal sito.';
            });
    }
})();
