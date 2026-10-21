/**
 * PEACE.js - http://humancopy.net/peace-js.html
 * Peace please, humancopy.net 2017
 * Version 1.4.0
 *
 */

var peaceJS;
(function() {

  var script_tag = document.querySelector('script[src*="peace.js"]'),
  // Read an attribute of the <script> tag, if there is one
  attr           = function(name) { return script_tag ? script_tag.getAttribute(name) : null; },
  auto_load      = script_tag && (attr('data-auto') === null || attr('data-auto') === 'true');

  peaceJS = function(options) {

    options = options || {};

    // If options is not an object we assume we got a DOM element (either string, element, jQuery object etc...)
    if (options.constructor != Object) options = {target: options};

    // No target given, use data-target or the parent of the <script> tag
    if (!options.target) options.target = attr('data-target') || (script_tag && script_tag.parentNode);
    // If the target is a text let's find it
    if (typeof options.target == 'string') options.target = document.querySelector(options.target);
    // Assume we got a jQuery object
    else if (options.target && !options.target.nodeType) options.target = options.target[0];

    // possible options: text (default), symbol
    options.style = options.style || attr('data-style') || 'text';

    // possible options: auto (default, black or white to suit the page), black, white, red, green & blue
    options.theme = options.theme || attr('data-theme') || 'auto';

    // how auto picks white: background (default, when the colour behind it is dark), device (when the device is in dark mode)
    options.dark = options.dark || attr('data-dark') || 'background';

    // possible options: '_blank' (default), _self, false (no link)
    options.link = options.link === false || options.link ? options.link : (attr('data-link') || '_blank');
    if (options.link === 'false') options.link = false;

    var peace      = ['Peace', 'Paz', 'שלום', 'سلام', '平和', 'शांति', 'Paix', 'мир', 'Pace', 'Frieden'],
    target_element = options.target || document.getElementsByTagName('footer')[0] || document.body;

    // Do the do if can do
    if (target_element) {
      // Load the CSS
      var link   = document.createElement('link');
      link.href  = 'https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.css';
      link.type  = 'text/css';
      link.rel   = 'stylesheet';
      link.media = 'screen,print';
      document.getElementsByTagName('head')[0].appendChild(link);

      // Create the peace containing paragraph & a text node
      var paragraph = document.createElement('P'),
      link_node     = document.createElement('A'),
      span_node     = document.createElement('SPAN');

      paragraph.className = 'peace ' + options.style + ' ' + options.theme;

      // Append & set the link element
      paragraph.appendChild(link_node);
      link_node.appendChild(document.createTextNode(peace.join(', ')));
      if (options.link) {
        link_node.href = 'https://peace.humancopy.net';
        link_node.setAttribute('target', options.link)
      }

      // Do we want to show the peace symbol?
      if (options.style == 'symbol') {
        // Append peace symbol element
        paragraph.appendChild(span_node);

        // onclick should show the link element
        span_node.onclick = function() {
          this.parentNode.className = this.parentNode.className + ' show';
        };

        // Append the peace symbol
        span_node.appendChild(document.createTextNode('☮'));
      }

      // Append it to target
      target_element.appendChild(paragraph);

      // Auto theme: go white on dark pages, and follow the page when it switches mode
      if (options.theme == 'auto' && window.matchMedia) {
        var dark_mode = window.matchMedia('(prefers-color-scheme: dark)'),
        paint         = function() {
          paragraph.classList.toggle('dark', options.dark == 'device' ? dark_mode.matches : is_dark(target_element));
        };
        paint();
        if (dark_mode.addEventListener) dark_mode.addEventListener('change', paint);
        // Sites with their own dark mode toggle usually flip a class on <html> or <body>
        if (options.dark != 'device' && window.MutationObserver) {
          var observer = new MutationObserver(paint);
          observer.observe(document.documentElement, {attributes: true});
          if (document.body) observer.observe(document.body, {attributes: true});
        }
      }
    }
  };

  // Is the first solid background colour behind the element dark?
  function is_dark(element) {
    for (; element && element.nodeType == 1; element = element.parentNode) {
      var rgba = getComputedStyle(element).backgroundColor.match(/[\d.]+/g);
      if (rgba && (rgba.length < 4 || +rgba[3] > 0)) return rgba[0] * .299 + rgba[1] * .587 + rgba[2] * .114 < 128;
    }
    // No background anywhere: the browser's canvas, dark only if the page opted into a dark color-scheme
    var meta = document.querySelector('meta[name="color-scheme"]');
    return /dark/.test(getComputedStyle(document.documentElement).colorScheme + (meta ? meta.content : '')) && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  if (auto_load) peaceJS();
})();
