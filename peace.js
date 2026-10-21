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
        else if (dark_mode.addListener) dark_mode.addListener(paint);
        // Sites with their own dark mode toggle usually flip a class on <html> or <body>
        if (options.dark != 'device' && window.MutationObserver) {
          var observer = new MutationObserver(paint);
          observer.observe(document.documentElement, {attributes: true});
          if (document.body) observer.observe(document.body, {attributes: true});
        }
      }
    }
  };

  // A 1x1 canvas the browser uses to turn any CSS colour (rgb, color(), oklch, lab...) into sRGB
  var pixel;

  // Is the colour behind the element dark? Blends translucent backgrounds down to the browser's canvas
  function is_dark(element) {
    var rgb = [0, 0, 0], weight = 1, meta = document.querySelector('meta[name="color-scheme"]'), color_scheme, canvas, i;
    if (!pixel) {
      pixel = document.createElement('canvas').getContext('2d', {willReadFrequently: true});
      pixel.globalCompositeOperation = 'copy';
    }
    for (; element && element.nodeType == 1 && weight > 0; element = element.parentNode) {
      pixel.fillStyle = getComputedStyle(element).backgroundColor;
      pixel.fillRect(0, 0, 1, 1);
      var rgba = pixel.getImageData(0, 0, 1, 1).data,
      alpha    = rgba[3] / 255;
      for (i = 0; i < 3; i++) rgb[i] += rgba[i] * alpha * weight;
      weight *= 1 - alpha;
    }
    // Whatever shows through is the canvas: dark if the page only offers dark, or offers both and the device is dark
    color_scheme = getComputedStyle(document.documentElement).colorScheme + ' ' + (meta ? meta.content : '');
    canvas = /dark/.test(color_scheme) && (!/light/.test(color_scheme) || window.matchMedia('(prefers-color-scheme: dark)').matches) ? 18 : 255;
    for (i = 0; i < 3; i++) rgb[i] += canvas * weight;
    return rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114 < 128;
  }

  if (auto_load) peaceJS();
})();
