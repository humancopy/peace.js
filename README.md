<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/dove-dark.svg">
  <img src=".github/assets/dove-light.svg" alt="" width="120">
</picture>

# peace.js

**Spread peace.**<br>
One line of JavaScript that adds a quiet wish for peace to the footer of your website.

[![npm](https://img.shields.io/npm/v/peace.js?style=flat-square&color=111)](https://www.npmjs.com/package/peace.js)
[![tests](https://img.shields.io/github/actions/workflow/status/humancopy/peace.js/test.yml?branch=master&style=flat-square&label=tests&color=111)](https://github.com/humancopy/peace.js/actions/workflows/test.yml)
[![size](https://img.shields.io/badge/gzipped-~1.1%20KB-111?style=flat-square)](dist/peace.min.js)
[![license](https://img.shields.io/badge/license-MIT-111?style=flat-square)](LICENSE)

Paz · שלום · سلام · 平和 · शांति · Paix · мир · Pace · Frieden

[**Website**](https://peace.humancopy.net) · [Options](#options) · [Share peace](SHARE.md)

</div>

<br>

## Quick start

Paste this before the closing `</body>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" async></script>
```

That's it. It injects itself at the same DOM level as the `<script>` tag, so you can paste it anywhere inside the `<body>`. It turns white on dark backgrounds, follows your dark mode toggle, and weighs next to nothing.

## Options

Everything is a `data-` attribute on the script tag.

| Attribute | Values | Default | |
| --- | --- | --- | --- |
| [`data-target`](#target) | any CSS selector | the script's parent | Where the banner goes |
| [`data-link`](#link) | `_blank`, `_self`, … or `false` | `_blank` | Where the banner links |
| [`data-theme`](#themes) | `auto` `black` `white` `green` `blue` `red` | `auto` | Color |
| [`data-dark`](#dark-mode) | `background` `device` | `background` | When `auto` turns white |
| [`data-style`](#style) | `text` `symbol` | `text` | Words or ☮ |
| [`data-auto`](#autoloading) | `true` `false` | `true` | Show it on load |

### Target

By default the banner is appended to the parent element of the `<script>` tag. To put it somewhere else, add `data-target`:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" data-target="#footer" async></script>
```

### Link

The banner links to the project's homepage and opens in a new window. Change it to open in the same window, or to not link at all (why would you want that is beyond me 😏). Accepts anything the [`a[target]`](https://developer.mozilla.org/docs/Web/HTML/Element/a#target) attribute does, or `false` to disable the link.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" data-link="_self" async></script>
```

### Themes

By default (`auto`) the banner is black, and turns white when the background behind it is dark. It fits light and dark pages, and follows your site when it switches between them: the device's dark mode, or your own toggle. To pick a fixed color, use `data-theme`:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" data-theme="blue" async></script>
```

### Dark mode

With the `auto` theme, `data-dark` chooses when the banner turns white: `background` (default) when the color behind it is dark, or `device` whenever the device is in dark mode.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" data-dark="device" async></script>
```

### Style

By default the banner shows the word *Peace* in different languages. Prefer a peace symbol? Use `data-style="symbol"`. On touch screens the first tap reveals the words, the second follows the link.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" data-style="symbol" async></script>
```

### Autoloading

Add `data-auto="false"` to hold the banner back, then call `peaceJS()` when you're ready.

`peaceJS()` takes an optional argument: a hash of options, a DOM element or a CSS selector. Options passed to it win over the ones on the `<script>` tag. Got a jQuery object or another list of elements? Pass a single element (`$('#footer')[0]`) or the selector string.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@2.0.2/dist/peace.min.js" data-auto="false" data-theme="green" data-link="_self" async></script>

<script>
// Default behaviour
peaceJS();

// Append to #footer in green theme
peaceJS('#footer');

// Append to #header, blue theme (wins over green), symbol style, no link back :(
peaceJS({
  target: '#header',
   theme: 'blue',
   style: 'symbol',
    link: false
});
</script>
```

## Hosting it yourself

<details>
<summary>Serve the files from your own domain, or install from npm or Bower</summary>

<br>

**peace.js** loads its stylesheet from the same place as the script, by swapping `.js` for `.css`: `peace.js` loads `peace.css`, and `peace.min.js` loads `peace.min.css`. The minified files are in `dist/`, which is also what Bower installs.

So when you serve the script yourself, keep the matching stylesheet next to it, and keep the file named `peace.js` or `peace.min.js` so the script can find its own `<script>` tag.

When the script is bundled into another file, or loaded by package name without a file (like `https://cdn.jsdelivr.net/npm/peace.js`), the stylesheet comes from jsDelivr.

</details>

## Development

<details>
<summary>Build and test</summary>

<br>

`dist/` is built from `peace.js` and `peace.css` with `npm run build`, and committed so Bower can install it. Rebuild it after changing either file.

The tests run **peace.js** in a real browser (Chromium, via [Playwright](https://playwright.dev)), checking the banner's colors on light, dark and see-through pages, every option, and where its stylesheet loads from. They run twice, on the source files and on `dist/`. Other tests check that `dist/` is up to date, and keep `peace.js` under its size budget once minified and gzipped.

```sh
npm install
npx playwright install chromium
npm run build
npm test
```

</details>

## Share peace

Using **peace.js**? Open a pull request to be listed in [SHARE.md](SHARE.md). 🕊️

<br>

<div align="center">
<sub>MIT · made by <a href="https://humancopy.net">humancopy</a></sub>
</div>
