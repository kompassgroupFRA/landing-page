/* Testi della pagina di conferma email nelle quattro lingue, più la logica
   che consuma il token: legge ?token= dall'URL (il link cliccato dall'utente
   nella mail inviata da backend/utils.js), chiama POST /api/verify-email e
   mostra l'esito. register.html, aperto in un'altra scheda o dispositivo,
   se ne accorge da solo tramite il polling su /api/check-verification. */

var VERIFY = {};

VERIFY.it = {
    pageTitle: 'Verifica email · ReplyMind',
    pageDesc: 'Conferma il tuo indirizzo email per attivare il trial ReplyMind.',
    checkingTitle: 'Verifica in corso...', checkingSub: 'Un attimo, stiamo confermando il tuo indirizzo.',
    okTitle: 'Email verificata!', okSub: 'Puoi tornare alla scheda dove hai iniziato la registrazione: continuerà da sola.', okBtn: 'Torna al sito →',
    errTitle: 'Link non valido', errSub: 'Il link è scaduto o è già stato usato. Riprova la registrazione dal sito.', errBtn: 'Torna alla registrazione →'
};
VERIFY.en = {
    pageTitle: 'Email verification · ReplyMind',
    pageDesc: 'Confirm your email address to activate your ReplyMind trial.',
    checkingTitle: 'Verifying...', checkingSub: 'One moment, we\'re confirming your address.',
    okTitle: 'Email verified!', okSub: 'You can go back to the tab where you started signing up: it will continue on its own.', okBtn: 'Back to the site →',
    errTitle: 'Invalid link', errSub: 'This link has expired or was already used. Try signing up again from the site.', errBtn: 'Back to sign up →'
};
VERIFY.ru = {
    pageTitle: 'Подтверждение email · ReplyMind',
    pageDesc: 'Подтвердите адрес электронной почты, чтобы активировать пробный период ReplyMind.',
    checkingTitle: 'Проверка...', checkingSub: 'Одну секунду, подтверждаем ваш адрес.',
    okTitle: 'Email подтверждён!', okSub: 'Вернитесь на вкладку, где вы начали регистрацию: она продолжит автоматически.', okBtn: 'Вернуться на сайт →',
    errTitle: 'Недействительная ссылка', errSub: 'Срок действия ссылки истёк или она уже использована. Попробуйте зарегистрироваться заново на сайте.', errBtn: 'Вернуться к регистрации →'
};
VERIFY.cn = {
    pageTitle: '邮箱验证 · ReplyMind',
    pageDesc: '确认您的邮箱地址以激活 ReplyMind 试用。',
    checkingTitle: '验证中...', checkingSub: '请稍候，正在确认您的邮箱地址。',
    okTitle: '邮箱已验证！', okSub: '您可以返回开始注册的标签页，它会自动继续。', okBtn: '返回首页 →',
    errTitle: '链接无效', errSub: '该链接已过期或已被使用。请从网站重新注册。', errBtn: '返回注册 →'
};

initLegalI18n(VERIFY, {});

(function () {
    'use strict';
    var API_BASE = /^(localhost|127\.0\.0\.1)$/.test(location.hostname)
        ? 'http://localhost:3000'
        : 'https://api.replymind.ai';

    function show(id) {
        ['stateChecking', 'stateOk', 'stateError'].forEach(function (key) {
            document.getElementById(key).classList.toggle('hidden', key !== id);
        });
    }

    var token = new URLSearchParams(location.search).get('token');
    if (!token) { show('stateError'); return; }

    fetch(API_BASE + '/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (r) { show(r.ok && r.data.success ? 'stateOk' : 'stateError'); })
        .catch(function () { show('stateError'); });
})();
