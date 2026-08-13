/* Testi della pagina di registrazione/checkout nelle quattro lingue.
   Caricato DOPO register.js: initLegalI18n() qui sotto applica le traduzioni
   e, tramite onRegisterLangChange, passa a register.js il dizionario attivo
   per i messaggi che quello compone dinamicamente (stato del polling, errori). */

var REGISTER = {};

REGISTER.it = {
    pageTitle: 'Crea il tuo account · ReplyMind',
    pageDesc: 'Registrati a ReplyMind: 100 risposte AI gratuite, nessuna carta di credito richiesta.',
    trialBadge: '🎯 100 risposte gratuite',
    s1Title: 'Crea il tuo account',
    s1Sub: 'Inizia il trial con 100 risposte AI gratuite',
    lblName: 'Nome',
    lblEmail: 'Email',
    cl1: '100 risposte AI gratuite', cl2: 'Tutti i marketplace supportati',
    cl3: 'Nessuna carta di credito richiesta', cl4: '🔒 BYOK — i tuoi dati rimangono tuoi',
    clp1: 'Continuerai su Telegram per il pagamento', clp2: 'Stars, carta o crypto',
    clp3: 'Licenza attivata subito dopo il pagamento',
    registerBtn: '🎯 Inizia il Trial →',
    registering: '⏳ Registrazione in corso...',
    termsLine: 'Continuando accetti i <a href="terms.html" id="termsLink">Termini di Servizio</a> e la <a href="privacy.html" id="privacyLink">Privacy Policy</a>',
    s2Title: 'Verifica la tua email',
    s2Sub: 'Abbiamo inviato un link di verifica a',
    s3tTitle: 'Trial attivato!',
    s3tSub: 'Hai 100 risposte AI gratuite. Installa l\'estensione e inizia a generare risposte su qualsiasi marketplace supportato.',
    s3tBtn: 'Torna al sito →',
    s3pTitle: 'Email verificata!',
    s3pSub: 'Ti stiamo portando su Telegram per completare il pagamento.',
    s3pBtn: 'Apri Telegram →',
    errInvalidEmail: 'Email non valida.',
    errGeneric: 'Errore durante la registrazione.',
    errNetwork: 'Errore di connessione. Riprova.',
    errOrder: 'Errore nella creazione dell\'ordine. Riprova dal sito.',
    waiting: '⏳ In attesa di verifica email...',
    verified: '✅ Email verificata con successo!',
    timeout: '⏰ Tempo scaduto. Non hai verificato l\'email: ricarica la pagina per riprovare.'
};

REGISTER.en = {
    pageTitle: 'Create your account · ReplyMind',
    pageDesc: 'Sign up for ReplyMind: 100 free AI replies, no credit card required.',
    trialBadge: '🎯 100 free replies',
    s1Title: 'Create your account',
    s1Sub: 'Start your trial with 100 free AI replies',
    lblName: 'Name',
    lblEmail: 'Email',
    cl1: '100 free AI replies', cl2: 'All supported marketplaces',
    cl3: 'No credit card required', cl4: '🔒 BYOK — your data stays yours',
    clp1: 'You\'ll continue on Telegram to pay', clp2: 'Stars, card or crypto',
    clp3: 'Licence activated right after payment',
    registerBtn: '🎯 Start the Trial →',
    registering: '⏳ Registering...',
    termsLine: 'By continuing you accept the <a href="terms.html" id="termsLink">Terms of Service</a> and <a href="privacy.html" id="privacyLink">Privacy Policy</a>',
    s2Title: 'Verify your email',
    s2Sub: 'We sent a verification link to',
    s3tTitle: 'Trial activated!',
    s3tSub: 'You have 100 free AI replies. Install the extension and start generating replies on any supported marketplace.',
    s3tBtn: 'Back to the site →',
    s3pTitle: 'Email verified!',
    s3pSub: 'Taking you to Telegram to complete payment.',
    s3pBtn: 'Open Telegram →',
    errInvalidEmail: 'Invalid email address.',
    errGeneric: 'Registration failed.',
    errNetwork: 'Connection error. Please try again.',
    errOrder: 'Could not create the order. Please try again from the site.',
    waiting: '⏳ Waiting for email verification...',
    verified: '✅ Email verified successfully!',
    timeout: '⏰ Time\'s up. You haven\'t verified your email: reload the page to try again.'
};

REGISTER.ru = {
    pageTitle: 'Создать аккаунт · ReplyMind',
    pageDesc: 'Регистрация в ReplyMind: 100 бесплатных AI-ответов, банковская карта не требуется.',
    trialBadge: '🎯 100 бесплатных ответов',
    s1Title: 'Создайте аккаунт',
    s1Sub: 'Начните пробный период со 100 бесплатными AI-ответами',
    lblName: 'Имя',
    lblEmail: 'Email',
    cl1: '100 бесплатных AI-ответов', cl2: 'Все поддерживаемые маркетплейсы',
    cl3: 'Банковская карта не требуется', cl4: '🔒 BYOK — ваши данные остаются у вас',
    clp1: 'Для оплаты вы перейдёте в Telegram', clp2: 'Stars, карта или крипта',
    clp3: 'Лицензия активируется сразу после оплаты',
    registerBtn: '🎯 Начать пробный период →',
    registering: '⏳ Регистрация...',
    termsLine: 'Продолжая, вы принимаете <a href="terms.html" id="termsLink">Условия использования</a> и <a href="privacy.html" id="privacyLink">Политику конфиденциальности</a>',
    s2Title: 'Подтвердите email',
    s2Sub: 'Мы отправили ссылку для подтверждения на',
    s3tTitle: 'Пробный период активирован!',
    s3tSub: 'У вас есть 100 бесплатных AI-ответов. Установите расширение и начните генерировать ответы на любом поддерживаемом маркетплейсе.',
    s3tBtn: 'Вернуться на сайт →',
    s3pTitle: 'Email подтверждён!',
    s3pSub: 'Переносим вас в Telegram для завершения оплаты.',
    s3pBtn: 'Открыть Telegram →',
    errInvalidEmail: 'Неверный адрес электронной почты.',
    errGeneric: 'Ошибка при регистрации.',
    errNetwork: 'Ошибка соединения. Попробуйте снова.',
    errOrder: 'Не удалось создать заказ. Попробуйте снова с сайта.',
    waiting: '⏳ Ожидание подтверждения email...',
    verified: '✅ Email успешно подтверждён!',
    timeout: '⏰ Время истекло. Вы не подтвердили email: перезагрузите страницу и попробуйте снова.'
};

REGISTER.cn = {
    pageTitle: '创建账户 · ReplyMind',
    pageDesc: '注册 ReplyMind：100 次免费 AI 回复，无需信用卡。',
    trialBadge: '🎯 100 次免费回复',
    s1Title: '创建您的账户',
    s1Sub: '开始试用，获得 100 次免费 AI 回复',
    lblName: '姓名',
    lblEmail: '电子邮箱',
    cl1: '100 次免费 AI 回复', cl2: '支持所有电商平台',
    cl3: '无需信用卡', cl4: '🔒 BYOK — 数据始终归您所有',
    clp1: '您将跳转至 Telegram 完成付款', clp2: 'Stars、银行卡或加密货币',
    clp3: '付款后立即激活许可证',
    registerBtn: '🎯 开始试用 →',
    registering: '⏳ 注册中...',
    termsLine: '继续即表示您同意<a href="terms.html" id="termsLink">服务条款</a>和<a href="privacy.html" id="privacyLink">隐私政策</a>',
    s2Title: '验证您的邮箱',
    s2Sub: '验证链接已发送至',
    s3tTitle: '试用已激活！',
    s3tSub: '您已获得 100 次免费 AI 回复。安装扩展后即可在任何支持的平台上生成回复。',
    s3tBtn: '返回首页 →',
    s3pTitle: '邮箱已验证！',
    s3pSub: '正在跳转至 Telegram 以完成付款。',
    s3pBtn: '打开 Telegram →',
    errInvalidEmail: '邮箱地址无效。',
    errGeneric: '注册失败。',
    errNetwork: '连接错误，请重试。',
    errOrder: '订单创建失败，请从网站重试。',
    waiting: '⏳ 等待邮箱验证...',
    verified: '✅ 邮箱验证成功！',
    timeout: '⏰ 超时。您尚未验证邮箱：请刷新页面重试。'
};

/* s2Sub e' seguito dall'indirizzo email inserito dall'utente (nodo separato
   #sentEmail, non markup): niente da dichiarare come HTML qui tranne termsLine. */
var REGISTER_HTML_KEYS = { termsLine: 1 };

initLegalI18n(REGISTER, REGISTER_HTML_KEYS, function (lang, texts) {
    if (window.onRegisterLangChange) window.onRegisterLangChange(lang, texts);
});
