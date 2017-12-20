/**
 * PEACE.js - http://humancopy.net/peace-js.html
 * Peace please, humancopy.net 2017
 * Version 1.1.6
 *
 */

var peaceJS;
(function() {

  var script_tag = document.querySelector('script[src*="peace.js"]'),
  auto_load      = script_tag && (script_tag.getAttribute('data-auto') === null || script_tag.getAttribute('data-auto') === 'true');

  peaceJS = function(options) {

    options = options || {};

    // Got a DOM element, array of objects (so get only the first one) or jQuery object
    if (options.nodeType || (options[0] && options[0].nodeType)) options = {target: options[0] || options};
    // Default
    else options.target = script_tag && (script_tag.getAttribute('data-target') || script_tag.parentNode);

    // if the target is a text let's find it
    if (typeof options.target == 'string' && options.target != '') options.target = document.querySelector(options.target);

    // possible options: text, symbol
    options.style = options.style || script_tag.getAttribute('data-style') || 'text';

    // possible options: black, white, green & blue
    options.theme = options.theme || script_tag.getAttribute('data-theme') || 'black';

    var peace      = ['Peace', 'Paz', 'שלום', 'سلام', '平和', 'शांति', 'Paix', 'мир', 'Pace', 'Frieden'],
    target_element = options.target || document.getElementsByTagName('footer')[0] || document.body;

    // Do the do if can do
    if (target_element) {
      // Load the CSS
      link       = document.createElement('link');
      link.href  = 'https://cdn.jsdelivr.net/npm/peace.js@1.1.6/dist/peace.min.css';
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
      link_node.href = 'https://humancopy.github.io/peace.js';
      link_node.appendChild(document.createTextNode(peace.join(', ')));

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
    }
  };

  if (auto_load) peaceJS();
})();

