(function () {
  'use strict';

  var CDN = 'https://cdn.jsdelivr.net/npm/peace.js@2.0.1/dist/peace.min.js';
  var SUN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  var MOON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var COLORS = { black: '#000000', white: '#ffffff', red: '#ee0000', green: '#00ee00', blue: '#0000ee' };
  var SWATCH = Object.assign({ auto: 'linear-gradient(90deg, #000000 50%, #ffffff 50%)' }, COLORS);
  var CHOICES = {
    theme: ['auto', 'black', 'white', 'red', 'green', 'blue'],
    dark: ['background', 'device'],
    style: ['text', 'symbol'],
    link: ['_blank', '_self', 'false'],
    auto: ['true', 'false']
  };

  var state = { theme: 'auto', dark: 'background', style: 'text', link: '_blank', auto: 'true', target: '', page: 'light' };
  var deviceDark = window.matchMedia('(prefers-color-scheme: dark)');
  var $ = function (id) { return document.getElementById(id); };

  function el(tag, props, children) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) { node[k] = props[k]; });
    (children || []).forEach(function (c) { node.append(c); });
    return node;
  }

  // Builder controls
  document.querySelectorAll('.opts[data-key]').forEach(function (group) {
    var key = group.dataset.key;
    CHOICES[key].forEach(function (value) {
      var button = el('button', { type: 'button', className: 'opt' });
      button.dataset.value = value;
      if (key === 'theme') {
        var swatch = el('span', { className: 'swatch' });
        swatch.style.background = SWATCH[value];
        button.append(swatch);
      }
      button.append(value);
      button.addEventListener('click', function () {
        state[key] = value;
        render();
      });
      group.append(button);
    });
  });

  $('target').addEventListener('input', function (e) {
    state.target = e.target.value.trim();
    render();
  });

  $('page-toggle').addEventListener('click', function () {
    state.page = state.page === 'dark' ? 'light' : 'dark';
    render();
  });

  function snippet() {
    var attrs = '';
    if (state.target) attrs += ' data-target="' + state.target.replace(/"/g, '&quot;') + '"';
    if (state.theme !== 'auto') attrs += ' data-theme="' + state.theme + '"';
    else if (state.dark !== 'background') attrs += ' data-dark="' + state.dark + '"';
    if (state.style !== 'text') attrs += ' data-style="' + state.style + '"';
    if (state.link !== '_blank') attrs += ' data-link="' + state.link + '"';
    if (state.auto !== 'true') attrs += ' data-auto="false"';
    return '<script src="' + CDN + '"' + attrs + ' async></' + 'script>';
  }

  function render() {
    document.querySelectorAll('.opts[data-key]').forEach(function (group) {
      var key = group.dataset.key;
      var disabled = key === 'dark' && state.theme !== 'auto';
      group.classList.toggle('off', disabled);
      group.querySelectorAll('.opt').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.value === state[key]));
        b.disabled = disabled;
      });
    });

    $('dark-hint').textContent = state.theme !== 'auto'
      ? 'Only applies to the auto theme.'
      : state.dark === 'device'
      ? 'White whenever the device is in dark mode — your device is ' + (deviceDark.matches ? 'dark' : 'light') + ' now.'
      : 'White when the page behind it is dark. Try the page toggle on the preview.';

    $('auto-hint').innerHTML = state.auto === 'true'
      ? 'Shows up as soon as the script loads.'
      : 'Nothing shows until you call <code>peaceJS()</code>, e.g. <code>peaceJS(\'#footer\')</code>.';

    var dark = state.page === 'dark';
    $('preview').classList.toggle('dark', dark);
    $('page-toggle').innerHTML = (dark ? MOON : SUN) + (dark ? 'Dark page' : 'Light page');

    inject();

    $('snippet').textContent = snippet();
  }

  var onSchemeChange = function () { render(); };
  if (deviceDark.addEventListener) deviceDark.addEventListener('change', onSchemeChange);
  else deviceDark.addListener(onSchemeChange);

  // Copy
  var copyTimer;
  $('copy').addEventListener('click', function () {
    var text = snippet();
    var done = function () {
      $('copy').textContent = 'Copied';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(function () { $('copy').textContent = 'Copy'; }, 1600);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
    function fallback() {
      var area = el('textarea', { value: text });
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.append(area);
      area.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      area.remove();
    }
  });

  // Real peace.js in every demo. Each peaceJS() call adds a stylesheet link and
  // listeners that are never removed, so only re-inject when the result would change.
  var injected = '';
  var injectTimer;
  function inject() {
    if (typeof peaceJS !== 'function') return;
    var key = [state.theme, state.dark, state.style, state.link, state.page].join();
    // cancel a pending injection first: switching back to what's shown must not let an older choice land
    clearTimeout(injectTimer);
    if (key === injected) return;
    injectTimer = setTimeout(function () {
      injected = key;
      var foot = $('preview-foot');
      foot.textContent = '';
      peaceJS({ target: foot, theme: state.theme, dark: state.dark, style: state.style, link: state.link === 'false' ? false : state.link });
    }, 80);
  }

  function ready() {
    $('demo-text').textContent = '';
    $('demo-symbol').textContent = '';
    peaceJS({ target: $('demo-text'), theme: 'auto', style: 'text' });
    peaceJS({ target: $('demo-symbol'), theme: 'auto', style: 'symbol' });
    inject();
  }
  if (typeof peaceJS === 'function') ready();
  else $('peace-script').addEventListener('load', ready);

  // GitHub stars, hidden unless the API answers
  fetch('https://api.github.com/repos/humancopy/peace.js')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (repo) {
      if (typeof repo.stargazers_count !== 'number') return;
      $('stars').textContent = repo.stargazers_count.toLocaleString('en');
      $('stars').hidden = false;
    })
    .catch(function () {});

  // Sharing list, read live from SHARE.md; the static list in the HTML is the fallback
  fetch('https://raw.githubusercontent.com/humancopy/peace.js/master/SHARE.md')
    .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); })
    .then(function (md) {
      var sites = [];
      md.split('\n').forEach(function (line) {
        var m = line.match(/^\s*\d+\.\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/);
        if (m) sites.push({ name: m[1].trim(), url: m[2] });
      });
      if (!sites.length) return;
      var list = $('sites');
      list.textContent = '';
      sites.forEach(function (site) {
        list.append(el('a', { href: site.url }, [
          el('span', { textContent: site.name }),
          el('span', { className: 'host', textContent: site.url.replace(/^https?:\/\//, '').replace(/\/$/, '') })
        ]));
      });
    })
    .catch(function () {});

  // Dove: flies in slow waves, turning a little in 3D, follows the pointer or finger and lifts with the scroll
  var dove = document.querySelector('.dove');
  if (dove && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var near = dove.querySelector('.wing-near'), far = dove.querySelector('.wing-far');
    var aim = { x: 0, y: 0 }, pos = { x: 0, y: 0 }, vel = { x: 0, y: 0 };
    var lift = 0, rise = 0, lastScroll = window.scrollY, last = 0, t = 0, frame = 0;
    // beside the title it drifts right, clear of the text; above it (phones) it stays within the screen
    var stacked = window.matchMedia('(max-width: 600px)');
    var clamp = function (v, max) { return Math.max(-max, Math.min(max, v)); };
    var wing = function (el, f) {
      // f runs 1 (up) to -1 (down); below 0 the wing sweeps under the body
      el.style.transform = 'scaleY(' + (1 - 0.7 * (1 - f)).toFixed(3) + ') rotate(' + (-6 * (1 - f)).toFixed(2) + 'deg)';
    };
    var step = function (now) {
      frame = requestAnimationFrame(step);
      var dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      t += dt;
      // a soft spring towards the pointer
      ['x', 'y'].forEach(function (k) {
        vel[k] += ((aim[k] - pos[k]) * 7 - vel[k] * 4.6) * dt;
        pos[k] += vel[k] * dt;
      });
      lift -= lift * 1.6 * dt;
      rise += (lift - rise) * Math.min(1, dt * 5);
      var flap = Math.sin(t * Math.PI * 1.8);
      // a lazy figure of eight, rising a little on each downstroke
      var x = pos.x + (stacked.matches ? Math.sin(t * 0.7) * 10 - 6 : 14 + Math.sin(t * 0.7) * 14);
      var y = pos.y + Math.sin(t * 1.4) * 6 + flap * 2 - rise;
      // bank into the wave, and come a touch closer and further away
      var bank = Math.cos(t * 1.4) * 4 + clamp(vel.y * 0.2 - rise * 0.12, 10);
      var depth = 1 + Math.sin(t * 0.7 + 1) * 0.04;
      dove.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px) rotate(' + bank.toFixed(2) + 'deg) scale(' + depth.toFixed(3) + ')';
      wing(near, flap);
      if (far) wing(far, Math.sin(t * Math.PI * 1.8 - 0.35));
    };
    var start = function () { if (!frame) { last = 0; frame = requestAnimationFrame(step); } };
    var stop = function () { cancelAnimationFrame(frame); frame = 0; };
    var follow = function (cx, cy) {
      var r = dove.getBoundingClientRect();
      aim.x = stacked.matches ? clamp((cx - r.left - r.width / 2 + pos.x) / 10, 20) : Math.max(-16, clamp((cx - r.left - r.width / 2 + pos.x) / 10, 70));
      aim.y = clamp((cy - r.top - r.height / 2 + pos.y) / 12, 40);
    };
    window.addEventListener('pointermove', function (e) { follow(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('touchmove', function (e) { follow(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener('scroll', function () {
      lift = clamp(lift + (window.scrollY - lastScroll) * 0.4, 50);
      lastScroll = window.scrollY;
    }, { passive: true });
    // only fly while it's on screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { entries[0].isIntersecting ? start() : stop(); }, { rootMargin: '120px' }).observe(dove);
    } else {
      start();
    }
    dove.classList.add('flying');
  }

  render();
})();
