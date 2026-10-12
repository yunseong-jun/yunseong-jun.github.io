/* ==========================================================================
   전윤성 포트폴리오 — script.js
   빌드 도구 없이 동작하는 Vanilla JavaScript입니다.
   기능: 모바일 메뉴 · 현재 섹션 표시 · 스크롤 진행 막대 · 프로젝트 상세 창
        · 관심 분야 연결 강조 · 연락처 복사 · 스크롤 등장 효과 · 사이트 점검(#qa)
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     화면에 표시되는 JS 문구 모음.
     영어 버전을 만들 때 <html lang="en">으로 바꾸면 en 문구가 쓰입니다.
     ------------------------------------------------------------------ */
  var UI_TEXT = {
    ko: {
      menu: '메뉴',
      menuClose: '닫기',
      menuOpenLabel: '메뉴 열기',
      menuCloseLabel: '메뉴 닫기',
      copy: '복사',
      copied: '복사됨',
      copiedLive: '클립보드에 복사했습니다.',
      copyFail: '자동 복사가 안 되어 주소를 선택해 두었습니다. 직접 복사해 주세요.',
      qaTitle: '사이트 점검 결과',
      qaClose: '닫기',
      qaSummary: function (p, w, f) { return '통과 ' + p + ' · 참고 ' + w + ' · 확인 필요 ' + f; },
      pass: '통과', warn: '참고', fail: '확인 필요',
      chkNav: '메뉴 링크가 섹션과 연결됨',
      chkNavOk: function (n) { return '메뉴 ' + n + '개가 모두 해당 섹션으로 이동합니다.'; },
      chkNavBad: function (list) { return '이동할 섹션이 없는 메뉴: ' + list; },
      chkLabel: '메뉴 문구와 섹션 제목 일치',
      chkLabelOk: '메뉴를 눌렀을 때 같은 이름의 제목이 나타납니다.',
      chkLabelBad: function (list) { return '이름이 다른 메뉴: ' + list; },
      chkAnchors: '페이지 안의 모든 링크가 목적지를 가짐',
      chkAnchorsOk: function (n) { return '내부 링크 ' + n + '개 확인.'; },
      chkAnchorsBad: function (list) { return '목적지가 없는 링크: ' + list; },
      chkDialogs: '프로젝트 상세 창 연결',
      chkDialogsOk: function (n) { return '상세 보기 버튼 ' + n + '개가 모두 상세 창과 연결됩니다.'; },
      chkDialogsBad: function (list) { return '연결된 상세 창이 없는 id: ' + list; },
      chkCards: '프로젝트 카드 필수 항목',
      chkCardsOk: function (n) { return '카드 ' + n + '개에 제목·연구 질문·요약·방법·진행 상태·버튼이 모두 있습니다.'; },
      chkCardsBad: function (list) { return '항목이 빠진 카드: ' + list; },
      chkIds: '중복 id 없음',
      chkIdsOk: 'id가 모두 고유합니다.',
      chkIdsBad: function (list) { return '중복된 id: ' + list; },
      chkHero: '첫 화면에 방문 대상과 목적 안내',
      chkHeroOk: '“이 페이지는” 안내 문구가 있습니다.',
      chkHeroBad: '첫 화면 안내 문구(data-check="audience")가 비어 있습니다.',
      chkPlaceholders: '아직 채우지 않은 자리',
      chkPlaceholdersOk: '모든 자리가 채워졌습니다.',
      chkPlaceholdersBad: function (list) { return '실제 정보로 바꿀 항목: ' + list; }
    },
    en: {
      menu: 'Menu',
      menuClose: 'Close',
      menuOpenLabel: 'Open menu',
      menuCloseLabel: 'Close menu',
      copy: 'Copy',
      copied: 'Copied',
      copiedLive: 'Copied to clipboard.',
      copyFail: 'Automatic copy failed. The address is selected — please copy it manually.',
      qaTitle: 'Site check',
      qaClose: 'Close',
      qaSummary: function (p, w, f) { return 'Pass ' + p + ' · Note ' + w + ' · Fix ' + f; },
      pass: 'Pass', warn: 'Note', fail: 'Fix',
      chkNav: 'Menu links reach their sections',
      chkNavOk: function (n) { return 'All ' + n + ' menu links have a target section.'; },
      chkNavBad: function (list) { return 'Menu items without a section: ' + list; },
      chkLabel: 'Menu labels match section titles',
      chkLabelOk: 'Each menu item lands on a heading with the same name.',
      chkLabelBad: function (list) { return 'Mismatched items: ' + list; },
      chkAnchors: 'Every in-page link has a destination',
      chkAnchorsOk: function (n) { return n + ' internal links checked.'; },
      chkAnchorsBad: function (list) { return 'Links without a destination: ' + list; },
      chkDialogs: 'Project detail dialogs connected',
      chkDialogsOk: function (n) { return 'All ' + n + ' detail triggers open a dialog.'; },
      chkDialogsBad: function (list) { return 'Missing dialog ids: ' + list; },
      chkCards: 'Project cards complete',
      chkCardsOk: function (n) { return 'All ' + n + ' cards have title, question, summary, methods, status and button.'; },
      chkCardsBad: function (list) { return 'Incomplete cards: ' + list; },
      chkIds: 'No duplicate ids',
      chkIdsOk: 'All ids are unique.',
      chkIdsBad: function (list) { return 'Duplicated ids: ' + list; },
      chkHero: 'First screen states audience and purpose',
      chkHeroOk: 'Visitor statement present.',
      chkHeroBad: 'The visitor statement (data-check="audience") is empty.',
      chkPlaceholders: 'Placeholders left to fill',
      chkPlaceholdersOk: 'Everything is filled in.',
      chkPlaceholdersBad: function (list) { return 'Replace with real information: ' + list; }
    }
  };

  var lang = (document.documentElement.lang || 'ko').slice(0, 2).toLowerCase();
  var T = UI_TEXT[lang] || UI_TEXT.ko;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var liveRegion = $('[data-live]');

  function announce(message) {
    if (!liveRegion) return;
    liveRegion.textContent = '';
    window.setTimeout(function () { liveRegion.textContent = message; }, 30);
  }

  function setHash(hash) {
    try {
      var url = window.location.pathname + window.location.search + (hash ? '#' + hash : '');
      window.history.replaceState(null, '', url);
    } catch (e) { /* 일부 환경에서는 주소 변경이 막혀 있어도 동작에는 문제없습니다. */ }
  }

  /* ------------------------------------------------------------------
     1. 모바일 메뉴
     ------------------------------------------------------------------ */
  var header = $('[data-header]');
  var nav = $('[data-nav]');
  var toggle = $('[data-menu-toggle]');
  var toggleLabel = $('[data-menu-label]');

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? T.menuCloseLabel : T.menuOpenLabel);
    if (toggleLabel) toggleLabel.textContent = open ? T.menuClose : T.menu;
  }

  if (toggle && nav) {
    setMenu(false);
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (event) {
      if (nav.classList.contains('is-open') && !header.contains(event.target)) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) setMenu(false);
    });
  }

  /* ------------------------------------------------------------------
     2. 현재 섹션 표시 + 스크롤 진행 막대 + 헤더 구분선
     ------------------------------------------------------------------ */
  var navLinks = $$('#site-nav a[href^="#"]');
  var tracked = navLinks
    .map(function (link) {
      return { link: link, section: document.getElementById(link.getAttribute('href').slice(1)) };
    })
    .filter(function (item) { return item.section; });
  var progressBar = $('[data-progress]');
  var ticking = false;

  function updateOnScroll() {
    ticking = false;
    var scrollY = window.scrollY || window.pageYOffset;
    var viewH = window.innerHeight;
    var docH = document.documentElement.scrollHeight;

    if (header) header.classList.toggle('is-scrolled', scrollY > 8);
    if (progressBar) {
      var max = Math.max(docH - viewH, 1);
      progressBar.style.setProperty('--progress', Math.min(scrollY / max, 1).toFixed(4));
    }

    // 화면 위쪽 35% 지점을 지난 마지막 섹션을 '현재 섹션'으로 봅니다.
    var marker = viewH * 0.35;
    var current = null;
    tracked.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= marker) current = item;
    });
    // 페이지 맨 아래에 닿으면 마지막 메뉴(연락처)를 표시합니다.
    if (scrollY + viewH >= docH - 4 && tracked.length) current = tracked[tracked.length - 1];

    tracked.forEach(function (item) {
      if (item === current) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateOnScroll);
    }
  }
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateOnScroll();

  /* ------------------------------------------------------------------
     3. 프로젝트 상세 창 (<dialog>)
        - data-open="dialog-id" 를 가진 버튼·링크를 누르면 열립니다.
        - 주소 끝에 #detail-recommendation 처럼 붙이면 바로 열린 상태로 공유할 수 있습니다.
     ------------------------------------------------------------------ */
  var lastTrigger = null;
  var dialogs = $$('dialog.project-dialog');
  var supportsDialog = dialogs.length > 0 && typeof dialogs[0].showModal === 'function';

  function openDialog(id, trigger) {
    var dialog = document.getElementById(id);
    if (!supportsDialog || !dialog || dialog.tagName !== 'DIALOG') return false;
    if (dialog.open) return true;
    dialogs.forEach(function (d) { if (d.open) d.close(); });
    lastTrigger = trigger || null;
    dialog.showModal();
    var body = $('.dialog-body', dialog);
    if (body) body.scrollTop = 0;
    setHash(id);
    return true;
  }

  if (supportsDialog) {
    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-open]');
      if (!trigger) return;
      if (openDialog(trigger.getAttribute('data-open'), trigger)) event.preventDefault();
    });

    dialogs.forEach(function (dialog) {
      // 바깥(어두운 배경)을 누르면 닫기
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog) dialog.close();
      });
      $$('[data-close]', dialog).forEach(function (btn) {
        btn.addEventListener('click', function () { dialog.close(); });
      });
      dialog.addEventListener('close', function () {
        if (window.location.hash === '#' + dialog.id) setHash('');
        if (lastTrigger && document.contains(lastTrigger)) {
          lastTrigger.focus({ preventScroll: true });
        } else {
          // 주소로 직접 열었던 경우: 해당 프로젝트 카드로 초점을 돌려줍니다.
          var cardButton = $('.project-open[data-open="' + dialog.id + '"]');
          if (cardButton) cardButton.focus({ preventScroll: false });
        }
        lastTrigger = null;
      });
    });

    var openFromHash = function () {
      var id = window.location.hash.slice(1);
      if (id && document.getElementById(id) && document.getElementById(id).tagName === 'DIALOG') {
        openDialog(id, null);
      }
    };
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  }

  /* ------------------------------------------------------------------
     4. 관심 분야: 영역과 교차 지점 서로 강조
     ------------------------------------------------------------------ */
  var map = $('[data-domain-map]');
  var xList = $('.x-list');
  var domainEls = $$('[data-domain]');
  var rowEls = $$('[data-domains]');

  function highlight(keys, sourceRow) {
    var active = Boolean(keys && keys.length);
    if (map) map.classList.toggle('is-focusing', active);
    if (xList) xList.classList.toggle('is-focusing', active);
    domainEls.forEach(function (el) {
      el.classList.toggle('is-linked', active && keys.indexOf(el.getAttribute('data-domain')) !== -1);
    });
    rowEls.forEach(function (row) {
      var rowKeys = row.getAttribute('data-domains').split(/\s+/);
      var linked = sourceRow ? row === sourceRow : active && rowKeys.indexOf(keys[0]) !== -1;
      row.classList.toggle('is-linked', linked);
    });
  }

  domainEls.forEach(function (el) {
    var key = el.getAttribute('data-domain');
    el.addEventListener('mouseenter', function () { highlight([key]); });
    el.addEventListener('mouseleave', function () { highlight(null); });
  });
  rowEls.forEach(function (row) {
    var keys = row.getAttribute('data-domains').split(/\s+/);
    row.addEventListener('mouseenter', function () { highlight(keys, row); });
    row.addEventListener('mouseleave', function () { highlight(null); });
    row.addEventListener('focusin', function () { highlight(keys, row); });
    row.addEventListener('focusout', function () { highlight(null); });
  });

  /* ------------------------------------------------------------------
     5. 연락처: href가 있으면 복사 버튼을 켭니다.
     ------------------------------------------------------------------ */
  $$('.contact-item').forEach(function (item) {
    var link = $('.contact-value', item);
    var button = $('[data-copy]', item);
    if (!link || !button || !link.hasAttribute('href')) return;

    button.hidden = false;
    button.textContent = T.copy;

    button.addEventListener('click', function () {
      var href = link.getAttribute('href');
      var text = href.indexOf('mailto:') === 0 ? href.slice(7) : href;

      var done = function () {
        button.textContent = T.copied;
        announce(T.copiedLive);
        window.setTimeout(function () { button.textContent = T.copy; }, 1800);
      };
      var fallback = function () {
        var range = document.createRange();
        range.selectNodeContents(link);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        announce(T.copyFail);
      };

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallback);
        } else {
          fallback();
        }
      } catch (e) {
        fallback();
      }
    });
  });

  /* ------------------------------------------------------------------
     6. 스크롤 등장 효과
        내용은 처음부터 모두 보입니다. 아직 화면 아래에 있는 요소만
        들어오기 직전에 짧은 애니메이션을 붙입니다.
     ------------------------------------------------------------------ */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (entry.boundingClientRect.top > window.innerHeight * 0.92) {
          el.classList.add('is-revealing');
          el.addEventListener('animationend', function () { el.classList.remove('is-revealing'); }, { once: true });
        }
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px 12% 0px' });

    $$('[data-reveal]').forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) revealObserver.observe(el);
    });
  }

  /* ------------------------------------------------------------------
     7. 사이트 점검 (#qa)
        주소 끝에 #qa 를 붙여 열면 화면 오른쪽 아래에 점검 결과가 나타납니다.
        메뉴 문구나 섹션을 수정한 뒤 이 결과로 연결이 깨지지 않았는지 확인하세요.
        개발자 도구 콘솔에서 siteCheck() 를 실행해도 같은 결과를 표로 볼 수 있습니다.
     ------------------------------------------------------------------ */
  function textOf(el) {
    return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function runSiteChecks() {
    var results = [];
    var add = function (status, label, detail) { results.push({ status: status, label: label, detail: detail }); };

    // 1) 메뉴 → 섹션
    var brokenNav = navLinks.filter(function (a) { return !document.getElementById(a.getAttribute('href').slice(1)); });
    add(brokenNav.length ? 'fail' : 'pass', T.chkNav,
      brokenNav.length ? T.chkNavBad(brokenNav.map(textOf).join(', ')) : T.chkNavOk(navLinks.length));

    // 2) 메뉴 문구 = 섹션 제목
    var mismatched = navLinks.filter(function (a) {
      var target = document.getElementById(a.getAttribute('href').slice(1));
      var heading = target && target.querySelector('.section-title');
      return target && heading && textOf(heading) !== textOf(a);
    });
    add(mismatched.length ? 'warn' : 'pass', T.chkLabel,
      mismatched.length
        ? T.chkLabelBad(mismatched.map(function (a) {
            var heading = document.getElementById(a.getAttribute('href').slice(1)).querySelector('.section-title');
            return '“' + textOf(a) + '” → “' + textOf(heading) + '”';
          }).join(', '))
        : T.chkLabelOk);

    // 3) 모든 내부 링크
    var anchors = $$('a[href^="#"]').filter(function (a) { return a.getAttribute('href').length > 1; });
    var brokenAnchors = anchors.filter(function (a) { return !document.getElementById(a.getAttribute('href').slice(1)); });
    add(brokenAnchors.length ? 'fail' : 'pass', T.chkAnchors,
      brokenAnchors.length ? T.chkAnchorsBad(brokenAnchors.map(function (a) { return a.getAttribute('href'); }).join(', ')) : T.chkAnchorsOk(anchors.length));

    // 4) 상세 창 연결
    var openers = $$('[data-open]');
    var missingDialogs = openers
      .map(function (el) { return el.getAttribute('data-open'); })
      .filter(function (id, i, arr) {
        var el = document.getElementById(id);
        return arr.indexOf(id) === i && (!el || el.tagName !== 'DIALOG');
      });
    add(missingDialogs.length ? 'fail' : 'pass', T.chkDialogs,
      missingDialogs.length ? T.chkDialogsBad(missingDialogs.join(', ')) : T.chkDialogsOk(openers.length));

    // 5) 카드 필수 항목
    var cards = $$('.project-card');
    var required = ['.project-title', '.project-rq', '.project-summary', '.project-fields', '.status-text', '.project-open'];
    var incomplete = cards.filter(function (card) {
      return required.some(function (sel) { return !textOf(card.querySelector(sel)); });
    });
    add(incomplete.length ? 'fail' : 'pass', T.chkCards,
      incomplete.length ? T.chkCardsBad(incomplete.map(function (c) { return c.id || '?'; }).join(', ')) : T.chkCardsOk(cards.length));

    // 6) 중복 id
    var seen = {};
    var dupes = [];
    $$('[id]').forEach(function (el) {
      if (seen[el.id] && dupes.indexOf(el.id) === -1) dupes.push(el.id);
      seen[el.id] = true;
    });
    add(dupes.length ? 'fail' : 'pass', T.chkIds, dupes.length ? T.chkIdsBad(dupes.join(', ')) : T.chkIdsOk);

    // 7) 첫 화면 안내
    var audience = $('[data-check="audience"]');
    add(textOf(audience) ? 'pass' : 'fail', T.chkHero, textOf(audience) ? T.chkHeroOk : T.chkHeroBad);

    // 8) 채우지 않은 자리
    var placeholders = $$('.contact-value:not([href])').map(function (el) {
      return textOf($('.contact-label', el.closest('.contact-item')));
    }).concat($$('[data-placeholder]').map(function (el) {
      return textOf($('.detail-title', el)) || 'placeholder';
    }));
    add(placeholders.length ? 'warn' : 'pass', T.chkPlaceholders,
      placeholders.length ? T.chkPlaceholdersBad(placeholders.join(', ')) : T.chkPlaceholdersOk);

    return results;
  }

  function renderQaPanel() {
    var existing = $('.qa-panel');
    if (existing) existing.remove();

    var results = runSiteChecks();
    var count = { pass: 0, warn: 0, fail: 0 };
    results.forEach(function (r) { count[r.status] += 1; });

    var panel = document.createElement('section');
    panel.className = 'qa-panel';
    panel.setAttribute('aria-label', T.qaTitle);

    var head = document.createElement('div');
    head.className = 'qa-head';
    var title = document.createElement('h2');
    title.className = 'qa-title';
    title.textContent = T.qaTitle;
    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'copy-btn';
    close.textContent = T.qaClose;
    close.addEventListener('click', function () {
      panel.remove();
      if (window.location.hash === '#qa') setHash('');
    });
    head.appendChild(title);
    head.appendChild(close);

    var summary = document.createElement('p');
    summary.className = 'qa-summary';
    summary.textContent = T.qaSummary(count.pass, count.warn, count.fail);

    var list = document.createElement('ul');
    list.className = 'qa-list';
    results.forEach(function (r) {
      var li = document.createElement('li');
      li.className = 'qa-item';
      var badge = document.createElement('span');
      badge.className = 'qa-badge qa-' + r.status;
      badge.textContent = T[r.status];
      var label = document.createElement('span');
      label.className = 'qa-label';
      label.textContent = r.label;
      var detail = document.createElement('span');
      detail.className = 'qa-detail';
      detail.textContent = r.detail;
      li.appendChild(badge);
      li.appendChild(label);
      li.appendChild(detail);
      list.appendChild(li);
    });

    panel.appendChild(head);
    panel.appendChild(summary);
    panel.appendChild(list);
    document.body.appendChild(panel);
    return results;
  }

  window.siteCheck = function () {
    var results = runSiteChecks();
    if (window.console && console.table) console.table(results);
    return results;
  };

  function qaFromHash() {
    if (window.location.hash === '#qa') renderQaPanel();
  }
  window.addEventListener('hashchange', qaFromHash);
  qaFromHash();
})();
