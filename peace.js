/**
 * PEACE.js - http://humancopy.net/peace-js.html
 * Peace please, humancopy.net 2017
 * Version 1.4.0
 *
 */

var peaceJS;
(function(document) {

  var script_tag = document.querySelector('script[src*="peace.js"]'),
  // The device's dark mode, where the browser can tell
  dark_mode      = window.matchMedia && matchMedia('(prefers-color-scheme: dark)'),
  // A 1x1 canvas that blends background colours (in any CSS syntax) into one sRGB pixel
  pixel;

  peaceJS = function(options) {

    // If options is not an object we assume we got a DOM element (either a selector string or an element)
    if (!options || options.constructor != Object) options = {target: options};

    // Read an option, else the data- attribute of the <script> tag, else the default
    var option = function(name, fallback) { return options[name] || script_tag && script_tag.getAttribute('data-' + name) || fallback; },
    // No target given, use data-target or the parent of the <script> tag
    target     = option('target', script_tag && script_tag.parentNode),
    // possible options: text (default), symbol
    style      = option('style', 'text'),
    // possible options: auto (default, black or white to suit the page), black, white, red, green & blue
    theme      = option('theme', 'auto'),
    // how auto picks white: background (default, when the colour behind it is dark), device (when the device is in dark mode)
    dark       = option('dark'),
    // possible options: '_blank' (default), _self, false (no link)
    link       = option('link', '_blank'),
    paragraph  = document.createElement('p'),
    css        = document.createElement('link'),
    paint      = function() {
      paragraph.classList.toggle('dark', dark == 'device' ? dark_mode.matches : is_dark(target));
    };

    // If the target is a text let's find it
    target = (typeof target == 'string' ? document.querySelector(target) : target) || document.querySelector('footer') || document.body;

    // Do the do if can do
    if (target) {
      // Load the CSS
      css.rel  = 'stylesheet';
      css.href = 'https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.css';
      document.head.appendChild(css);

      paragraph.className = 'peace ' + style + ' ' + theme;
      paragraph.innerHTML = '<a>Peace, Paz, שלום, سلام, 平和, शांति, Paix, мир, Pace, Frieden</a>' + (style == 'symbol' ? '<span>☮</span>' : '');
      if (options.link !== false && link != 'false') {
        paragraph.firstChild.href   = 'https://peace.humancopy.net';
        paragraph.firstChild.target = link;
      }
      // Tapping the symbol shows the words
      if (style == 'symbol') paragraph.lastChild.onclick = function() { paragraph.classList.add('show'); };
      target.appendChild(paragraph);

      // Auto theme: go white on dark pages, and follow the page when the device switches mode
      // or the site's own dark mode toggle flips a class on <html> or <body>
      if (theme == 'auto' && dark_mode) {
        paint();
        dark_mode.addListener(paint);
        [document.documentElement, document.body].forEach(function(node) {
          node && new MutationObserver(paint).observe(node, {attributes: true});
        });
      }
    }
  };

  // Is the colour behind the element dark? Paints the browser's canvas, then every background
  // from <html> down to the element, and reads the resulting pixel
  function is_dark(element) {
    var meta = document.querySelector('meta[name=color-scheme]'),
    scheme   = getComputedStyle(document.documentElement).colorScheme + (meta ? meta.content : ''),
    // The canvas is dark if the page only offers dark, or offers both and the device is dark
    canvas   = /dark/.test(scheme) && (!/light/.test(scheme) || dark_mode.matches) ? '#121212' : '#fff',
    rgb;
    pixel = pixel || document.createElement('canvas').getContext('2d', {willReadFrequently: true});
    // Climb to <html> first, so each background is painted over the ones behind it
    (function fill(node) {
      pixel.fillStyle = node && node.nodeType == 1 ? (fill(node.parentNode), getComputedStyle(node).backgroundColor) : canvas;
      pixel.fillRect(0, 0, 1, 1);
    })(element);
    rgb = pixel.getImageData(0, 0, 1, 1).data;
    return rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114 < 128;
  }

  // Autoload unless data-auto is set to anything but "true"
  if (script_tag && !script_tag.matches('[data-auto]:not([data-auto=true])')) peaceJS();
})(document);
