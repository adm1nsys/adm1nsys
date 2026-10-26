(() => {
  const SITE = window.SITE;
  const I18N = window.I18N;
  const LANGS = ['de', 'en', 'uk', 'ru', 'da', 'fr'];
  const LABELS = { de: 'DE', en: 'EN', uk: 'UA', ru: 'RU', da: 'DA', fr: 'FR' };
  const STORE_KEY = 'adm1nsys.lang';

  const ICONS = {
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    badge: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    stack: '<rect x="4" y="4" width="16" height="6" rx="1.5"/><rect x="4" y="14" width="16" height="6" rx="1.5"/>',
    note: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    arrow: '<path d="M7 17L17 7M8 7h9v9"/>'
  };
  const icon = (name, cls = 'icon') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch { return null; } },
    set(value) { try { localStorage.setItem(STORE_KEY, value); } catch { /* private mode */ } }
  };

  const fromUrl = new URLSearchParams(location.search).get('lang');
  const stored = store.get();
  let lang = LANGS.includes(fromUrl) ? fromUrl : LANGS.includes(stored) ? stored : 'de';

  const t = (key, l = lang) => I18N[l]?.[key] ?? I18N.de[key] ?? '';
  const page = document.body.dataset.page;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  // Sections of the main page, reachable from the header menu on every page
  const SECTIONS = [
    { id: 'about', label: 'aboutTitle', icon: 'person' },
    { id: 'focus', label: 'focusTitle', icon: 'target' },
    { id: 'projects', label: 'projectsTitle', icon: 'stack' },
    { id: 'tools', label: 'toolsTitle', icon: 'wrench' },
    { id: 'education', label: 'eduTitle', icon: 'cap' },
    { id: 'certificates', label: 'certTitle', icon: 'badge' },
    { id: 'contact', label: 'contactTitle', icon: 'mail' }
  ];

  // Header, header menu and footer are shared by every page
  function renderChrome() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <div class="header-left">
        <a class="brand" href="index.html">adm1nsys</a>
        <div class="lang">
          <button class="chip lang-toggle" type="button" aria-haspopup="true" aria-expanded="false" data-i18n-aria="language">
            <span data-lang-current>${LABELS[lang]}</span>${icon('chevron', 'icon icon-sm')}
          </button>
          <div class="lang-list" hidden>
            ${LANGS.map((l) => `<button type="button" data-set-lang="${l}">${LABELS[l]}</button>`).join('')}
            <button type="button" class="lang-close" data-i18n-aria="close">✕</button>
          </div>
        </div>
      </div>
      <button class="chip menu-toggle" type="button" aria-controls="menu" aria-expanded="false" data-i18n="menu">${t('menu')}</button>`;
    document.body.prepend(header);

    const base = page === 'about' ? '' : 'index.html';
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu';
    menu.hidden = true;
    menu.innerHTML = `
      <nav class="menu-grid">
        <button class="tile" type="button" data-menu-close>
          <span class="tile-icon">${icon('close')}</span><span class="tile-label" data-i18n="close">${t('close')}</span>
        </button>
        ${SECTIONS.map((s) => `
          <a class="tile" href="${base}#${s.id}" data-menu-close>
            <span class="tile-icon">${icon(s.icon)}</span><span class="tile-label" data-i18n="${s.label}">${t(s.label)}</span>
          </a>`).join('')}
      </nav>`;
    document.body.append(menu);

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap footer-row">
        <span>© ${new Date().getFullYear()} ${esc(SITE.name)}</span>
        <span class="footer-links">
          <a href="links.html#ukraine" data-i18n="footerUkraine">${t('footerUkraine')}</a>
          <a href="${SITE.repo}" target="_blank" rel="noopener" data-i18n="footerSource">${t('footerSource')}</a>
        </span>
      </div>`;
    document.body.append(footer);
  }

  function bindLanguage() {
    const toggle = document.querySelector('.lang-toggle');
    const list = document.querySelector('.lang-list');
    const setOpen = (open) => {
      list.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(list.hidden));
    list.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.dataset.setLang) setLang(btn.dataset.setLang);
      setOpen(false);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.lang')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  function bindMenu() {
    const menu = document.getElementById('menu');
    const toggle = document.querySelector('.menu-toggle');
    let hideTimer;
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      document.documentElement.classList.toggle('menu-open', open);
      clearTimeout(hideTimer);
      if (open) {
        menu.hidden = false;
        void menu.offsetWidth; // start the fade from opacity 0
        menu.classList.add('is-open');
        menu.querySelector('.tile').focus();
      } else {
        menu.classList.remove('is-open');
        hideTimer = setTimeout(() => { menu.hidden = true; }, 250);
      }
    };
    toggle.addEventListener('click', () => setOpen(true));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('[data-menu-close]') || e.target === menu) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.hidden) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Tiles of the standalone menu.html page
  function renderMenu() {
    const grid = document.querySelector('[data-menu-tiles]');
    if (!grid) return;
    grid.innerHTML = SITE.pages.map((p) => `
      <a class="tile" href="${p.href}">
        <span class="tile-icon">${icon(p.icon)}</span><span class="tile-label" data-i18n="${p.label}">${t(p.label)}</span>
      </a>`).join('');
  }

  // Offer the visitor's own language once, like on adm1nsys.github.io/inc
  function suggestLanguage() {
    if (fromUrl || stored) return;
    const preferred = (navigator.languages || [navigator.language])
      .map((l) => l.toLowerCase().slice(0, 2))
      .map((l) => (l === 'ua' ? 'uk' : l))
      .find((l) => LANGS.includes(l));
    if (!preferred || preferred === lang) return;

    const bar = document.createElement('div');
    bar.className = 'suggest';
    bar.innerHTML = `
      <p>${esc(t('suggestText', preferred))}</p>
      <div class="suggest-actions">
        <button type="button" class="btn btn-primary btn-sm" data-apply>${esc(t('suggestApply', preferred))}</button>
        <button type="button" class="btn btn-ghost btn-sm" data-stay>${esc(t('suggestStay'))}</button>
      </div>`;
    document.body.append(bar);
    void bar.offsetWidth;
    bar.classList.add('is-visible');
    const dismiss = () => {
      bar.classList.remove('is-visible');
      setTimeout(() => bar.remove(), 300);
    };
    bar.querySelector('[data-apply]').addEventListener('click', () => { setLang(preferred); dismiss(); });
    bar.querySelector('[data-stay]').addEventListener('click', () => { store.set(lang); dismiss(); });
  }

  function renderPersonal() {
    document.querySelectorAll('[data-email]').forEach((el) => {
      if (SITE.email) el.href = `mailto:${SITE.email}`;
      else el.remove();
    });
    document.querySelectorAll('[data-cv]').forEach((el) => {
      if (SITE.cv) el.href = SITE.cv;
      else el.remove();
    });

    const photo = document.querySelector('[data-photo]');
    if (!photo || !SITE.photo) return;
    const initials = photo.textContent;
    photo.innerHTML = `<img src="${esc(SITE.photo)}" alt="${esc(SITE.name)}">`;
    photo.querySelector('img').onerror = () => { photo.textContent = initials; };
  }

  function bindBack() {
    // Go back in history when we came from this site, otherwise to the main page
    document.querySelectorAll('[data-back]').forEach((link) => {
      link.addEventListener('click', (e) => {
        let sameSite = false;
        try { sameSite = new URL(document.referrer).origin === location.origin; } catch { /* no referrer */ }
        if (sameSite && history.length > 1) {
          e.preventDefault();
          history.back();
        }
      });
    });
  }

  function renderMusic() {
    const root = document.querySelector('[data-playlists]');
    if (!root) return;
    if (!SITE.playlists.length) {
      root.innerHTML = `<p class="empty" data-i18n="musicEmpty">${t('musicEmpty')}</p>`;
      return;
    }
    root.innerHTML = SITE.playlists.map((p) => `
      <article class="playlist card">
        <iframe src="${esc(p.url.replace('://music.apple.com', '://embed.music.apple.com'))}"
          title="${esc(p.title || 'Apple Music')}" loading="lazy"
          allow="autoplay *; encrypted-media *; clipboard-write"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"></iframe>
        <a class="text-link" href="${esc(p.url)}" target="_blank" rel="noopener">
          <span data-i18n="musicOpen">${t('musicOpen')}</span>${icon('arrow', 'icon icon-sm')}
        </a>
      </article>`).join('');
  }

  function renderLinks() {
    const row = (name, handle, url) => `
      <a class="link-row" href="${esc(url)}" ${url.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener"'}>
        <span class="link-name">${esc(name)}</span>
        <span class="link-handle">${esc(handle)}</span>
        ${icon('arrow')}
      </a>`;
    const email = SITE.email ? row('E-Mail', SITE.email, `mailto:${SITE.email}`) : '';
    const socials = SITE.socials.map((s) => row(s.name, s.handle, s.url)).join('');

    const contactBlock = document.querySelector('[data-contact-links]');
    if (contactBlock) contactBlock.innerHTML = email + socials;

    const contact = document.querySelector('[data-links-contact]');
    if (contact) {
      if (email) contact.innerHTML = email;
      else contact.closest('section').remove();
    }
    const socialList = document.querySelector('[data-links-socials]');
    if (socialList) socialList.innerHTML = socials;
    const support = document.querySelector('[data-links-support]');
    if (support) support.innerHTML = SITE.support.map((s) => row(s.name, new URL(s.url).host, s.url)).join('');
  }

  // Birthday easter egg: on 18 October (German time) the profile card celebrates.
  // Any other day it can be triggered from the console: birthday(), birthday(false).
  const birthYear = Number(SITE.birthday.slice(0, 4));
  let birthdayOn = false;

  function isBirthdayToday() {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', month: '2-digit', day: '2-digit' }).format(new Date());
    return today === SITE.birthday.slice(5);
  }

  // Age on this year's birthday — also what a console-triggered birthday shows
  const birthdayAge = () => new Date().getFullYear() - birthYear;

  function renderBirthday() {
    const note = document.querySelector('[data-birthday-note]');
    if (!note) return;
    note.hidden = !birthdayOn;
    note.textContent = t('birthday').replace('{n}', birthdayAge());
  }

  function confetti() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#f9f9f9'];
    const layer = document.createElement('div');
    layer.className = 'confetti';
    layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 90; i++) {
      const piece = document.createElement('i');
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 30}vw`);
      piece.style.setProperty('--spin', `${(Math.random() - 0.5) * 1440}deg`);
      piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      layer.append(piece);
    }
    document.body.append(layer);
    setTimeout(() => layer.remove(), 5500);
  }

  function setBirthday(on) {
    birthdayOn = on;
    document.documentElement.classList.toggle('is-birthday', on);
    renderBirthday();
    if (on) confetti();
  }

  window.birthday = (on = true) => {
    setBirthday(Boolean(on));
    return on ? '🎂' : 'ok';
  };

  // macOS-style HUD, the same idea as the "language changed" panel on adm1nsys.github.io/inc
  function showLangHud() {
    document.querySelector('.lang-hud')?.remove();
    const hud = document.createElement('div');
    hud.className = 'lang-hud';
    hud.setAttribute('role', 'status');
    hud.innerHTML = `<span class="lang-hud-code">${LABELS[lang]}</span><span class="lang-hud-text">${esc(t('langChanged'))}</span>`;
    document.body.append(hud);
    void hud.offsetWidth;
    hud.classList.add('is-visible');
    setTimeout(() => hud.classList.remove('is-visible'), 1000);
    setTimeout(() => hud.remove(), 1500);
  }

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    const current = document.querySelector('[data-lang-current]');
    if (current) current.textContent = LABELS[lang];
    document.querySelectorAll('[data-set-lang]').forEach((b) => {
      b.classList.toggle('is-active', b.dataset.setLang === lang);
    });
    renderBirthday();
  }

  function setLang(next) {
    const changed = next !== lang;
    lang = next;
    store.set(next);
    if (fromUrl) history.replaceState(null, '', location.pathname + location.hash);
    applyLanguage();
    if (changed) showLangHud();
  }

  renderChrome();
  renderPersonal();
  renderMusic();
  renderLinks();
  bindLanguage();
  renderMenu();
  bindMenu();
  bindBack();
  applyLanguage();
  suggestLanguage();
  if (isBirthdayToday()) setBirthday(true);
  console.log('%cadm1nsys', 'font: 500 20px "Roboto Mono", monospace', '\nPsst… try birthday() 🎂');
})();
