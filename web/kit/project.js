// Shared chrome for project sites (adm1nsys.github.io/<repo>/): header, language switch,
// footer and the version history. A page sets window.PROJECT before loading this file:
//   { repo: 'adm1nsys/<repo>', name, license, langs: ['de', 'en'], i18n: { de: {...}, en: {...} } }
// Texts: data-i18n="key" (text) and data-i18n-html="key" (markup) on any element.
(() => {
  const P = window.PROJECT;
  const HOME = '/adm1nsys/';
  const STORE_KEY = 'adm1nsys.lang'; // same key as the main site, so the choice carries over
  const LABELS = { de: 'DE', en: 'EN', uk: 'UA', ru: 'RU', da: 'DA', fr: 'FR' };
  const UI = {
    de: { back: 'Projekte', source: 'Quellcode auf GitHub', latest: 'Aktuell', files: 'Dateien',
      sourceZip: 'Quellcode (zip)', noReleases: 'Noch keine Releases — die aktuelle Fassung liegt im Hauptzweig.',
      history: 'Änderungsverlauf', loadError: 'Versionen konnten nicht geladen werden.', language: 'Sprache' },
    en: { back: 'Projects', source: 'Source on GitHub', latest: 'Latest', files: 'Files',
      sourceZip: 'Source code (zip)', noReleases: 'No releases yet — the current version is on the main branch.',
      history: 'Change history', loadError: 'Could not load the versions.', language: 'Language' }
  };

  const store = {
    get() { try { return localStorage.getItem(STORE_KEY); } catch { return null; } },
    set(value) { try { localStorage.setItem(STORE_KEY, value); } catch { /* private mode */ } }
  };
  const params = new URLSearchParams(location.search);
  const fromHome = params.get('from') === 'adm1nsys';
  const pick = (l) => (P.langs.includes(l) ? l : null);
  // URL ?lang= → saved choice → English for languages this page lacks → German like the main site
  let lang = pick(params.get('lang')) || pick(store.get()) || (store.get() ? pick('en') : null) || P.langs[0];

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const t = (key) => P.i18n[lang]?.[key] ?? UI[lang]?.[key] ?? P.i18n.en?.[key] ?? UI.en[key] ?? '';
  const ICONS = {
    chevron: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M15 18l-6-6 6-6"/>',
    down: '<path d="M12 4v12M6 12l6 6 6-6M5 20h14"/>'
  };
  const icon = (name, cls = 'icon') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

  function renderChrome() {
    const header = document.createElement('header');
    header.className = 'site-header';
    // From adm1nsys: a way back to the list. From GitHub or a link: just the brand, leading home.
    const back = fromHome
      ? `<a class="chip chip-back" href="${HOME}projects.html">${icon('left', 'icon icon-sm')}<span data-ui="back"></span></a>`
      : '';
    header.innerHTML = `
      <div class="header-left">
        <a class="brand" href="${HOME}">adm1nsys</a>
        ${back}
      </div>
      <div class="lang">
        <button class="chip lang-toggle" type="button" aria-haspopup="true" aria-expanded="false">
          <span data-lang-current></span>${icon('chevron', 'icon icon-sm')}
        </button>
        <div class="lang-list" hidden>
          ${P.langs.map((l) => `<button type="button" data-set-lang="${l}">${LABELS[l]}</button>`).join('')}
        </div>
      </div>`;
    document.body.prepend(header);

    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap footer-row">
        <span>© ${new Date().getFullYear()} Heorhii Romanenko${P.license ? ` · ${esc(P.license)}` : ''}</span>
        <span class="footer-links">
          <a href="${HOME}">adm1nsys</a>
          <a href="https://github.com/${P.repo}" target="_blank" rel="noopener" data-ui="source"></a>
        </span>
      </div>`;
    document.body.append(footer);

    // Keep "came from adm1nsys" when moving between pages of the same project site
    if (fromHome) {
      document.querySelectorAll('a[href]').forEach((a) => {
        const url = new URL(a.href, location.href);
        if (url.origin === location.origin && url.pathname.startsWith(location.pathname.replace(/[^/]*$/, ''))
          && !url.searchParams.has('from')) {
          url.searchParams.set('from', 'adm1nsys');
          a.href = url.pathname + url.search + url.hash;
        }
      });
    }
  }

  function bindLanguage() {
    const toggle = document.querySelector('.lang-toggle');
    const list = document.querySelector('.lang-list');
    const setOpen = (open) => { list.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); };
    toggle.addEventListener('click', () => setOpen(list.hidden));
    document.addEventListener('click', (e) => { if (!e.target.closest('.lang')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    list.addEventListener('click', (e) => {
      const button = e.target.closest('[data-set-lang]');
      if (!button) return;
      lang = button.dataset.setLang;
      store.set(lang);
      setOpen(false);
      applyLanguage();
      renderReleases();
    });
  }

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-ui]').forEach((el) => { el.textContent = t(el.dataset.ui); });
    document.querySelector('[data-lang-current]').textContent = LABELS[lang];
    document.querySelector('.lang-toggle').setAttribute('aria-label', t('language'));
    document.querySelectorAll('[data-set-lang]').forEach((b) => b.classList.toggle('is-active', b.dataset.setLang === lang));
    if (P.i18n[lang]?.title) document.title = P.i18n[lang].title;
  }

  // ---------- Version history: every GitHub release with direct links to its files ----------

  let releases = null; // null = not loaded yet, [] = none, 'error' = request failed

  async function loadReleases() {
    try {
      const response = await fetch(`https://api.github.com/repos/${P.repo}/releases?per_page=50`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error(response.status);
      releases = (await response.json()).filter((r) => !r.draft);
    } catch {
      releases = 'error';
    }
    renderReleases();
    bindDownloads();
  }

  // Release notes are Markdown; enough of it for GitHub-style notes: lists, `code`, **bold**, links
  function notes(text) {
    const inline = (s) => esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    let html = '';
    let list = false;
    for (const line of text.trim().split(/\r?\n/)) {
      const item = line.match(/^\s*[-*]\s+(.*)/);
      if (item && !list) { html += '<ul>'; list = true; }
      if (!item && list) { html += '</ul>'; list = false; }
      if (item) html += `<li>${inline(item[1])}</li>`;
      else if (/^#+\s/.test(line)) html += `<p><strong>${inline(line.replace(/^#+\s/, ''))}</strong></p>`;
      else if (line.trim()) html += `<p>${inline(line)}</p>`;
    }
    return html + (list ? '</ul>' : '');
  }

  function renderReleases() {
    const root = document.querySelector('[data-releases]');
    if (!root || releases === null) return;
    const date = (iso) => new Date(iso).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' });
    const historyLink = `<a class="text-link" href="https://github.com/${P.repo}/commits/" target="_blank" rel="noopener">${esc(t('history'))} ↗</a>`;

    if (releases === 'error' || !releases.length) {
      root.innerHTML = `<p>${esc(t(releases === 'error' ? 'loadError' : 'noReleases'))}</p>
        <div class="release-files">${(P.fallback || []).map((f) =>
          `<a class="btn btn-sm" href="${esc(f.url)}">${icon('down', 'icon icon-sm')}${esc(f.label)}</a>`).join('')}</div>
        <p class="meta">${historyLink}</p>`;
      return;
    }
    root.innerHTML = `<div class="releases">${releases.map((r, i) => `
      <details class="release"${i === 0 ? ' open' : ''}>
        <summary>
          <span class="release-version">${esc(r.name || r.tag_name)}</span>
          ${i === 0 ? `<span class="release-badge">${esc(t('latest'))}</span>` : ''}
          <span class="release-date">${date(r.published_at)}</span>
        </summary>
        <div class="release-body">
          ${r.body ? `<div class="release-notes">${notes(r.body)}</div>` : ''}
          <div class="release-files">
            ${r.assets.map((a) => `<a class="btn btn-sm${i === 0 ? ' btn-primary' : ''}" href="${esc(a.browser_download_url)}">${icon('down', 'icon icon-sm')}${esc(a.name)}</a>`).join('')}
            <a class="btn btn-sm" href="${esc(r.zipball_url.replace('api.github.com/repos', 'github.com').replace('/zipball/', '/archive/refs/tags/'))}.zip">${esc(t('sourceZip'))}</a>
          </div>
        </div>
      </details>`).join('')}</div>
      <p class="meta">${historyLink}</p>`;
  }

  // A [data-download="file name"] button points at that file in the newest release that has it
  function bindDownloads() {
    if (!Array.isArray(releases)) return;
    document.querySelectorAll('[data-download]').forEach((el) => {
      for (const r of releases) {
        const asset = r.assets.find((a) => a.name === el.dataset.download);
        if (asset) { el.href = asset.browser_download_url; break; }
      }
    });
  }

  document.body.classList.add('project-page');
  renderChrome();
  bindLanguage();
  applyLanguage();
  loadReleases();
})();
