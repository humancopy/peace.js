# PEACE.JS

Add the following piece (~no~ pun intended) of code before the closing ```</body>``` tag on your website to promote **PEACE.JS**:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" async></script>
```

*You can actually paste it anywhere inside the ```<body>```. It will inject itself at the same DOM level as the ```<script>``` tag.*

## Target

By default, **PEACE.JS** will be appeneded to the parent element of the ```<script>``` tag. If you'd like to inject it somewhere else, simply add the `data-target` attribute:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" data-target="#footer" async></script>
```

## Link

**PEACE.JS** will automatically link the generated peace banner to the project's homepage. By default the link will open in a new window. You can either change it to open in the same window or to not have any link at all (why would you want to do that though is beyond me :smirk:). Possible values are: anything supported by the [a[target]](https://www.w3schools.com/tags/att_a_target.asp) attribute or `false` to disable the link.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" data-link="_self" async></script>
```

## Themes

By default (`auto`) **PEACE.JS** is black, and turns white when the background behind it is dark — so it fits light and dark pages, and follows your site when it switches between them (the device's dark mode, or your own dark mode toggle). To pick a fixed color use the `data-theme` attribute. Possible values are: `auto`, `black`, `white`, `green`, `blue` & `red`.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" data-theme="blue" async></script>
```

## Dark mode

With the `auto` theme, the `data-dark` attribute chooses when **PEACE.JS** turns white. Possible values are: `background` (default) to go white when the color behind it is dark, or `device` to go white whenever the device is in dark mode.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" data-dark="device" async></script>
```

## Style

By default, **PEACE.JS** will show the word Peace in different languages. If you prefer instead to show a peace symbol, simply add the `data-style="symbol"` attribute to the script tag. Possible values are: `text`, `symbol`

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" data-style="symbol" async></script>
```

## Autoloading

You can also disable the automatic activation of the banner by adding the attribute `data-auto="false"` to the script. You can then activate it by calling the ```peaceJS()``` function.

The ```peaceJS()``` function accepts an optional argument of either a hash of options, a DOM element or a CSS selector. Any option passed to ```peaceJS()``` has precedence over what was defined on the ```<script>``` tag. Got a jQuery object or any other list of elements (NodeList, HTMLCollection, array)? Pass a single element (```$('#footer')[0]```, ```list[0]```) or the selector string.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.4.0/peace.min.js" data-auto="false" data-theme="green" data-link="_self" async></script>

<script>
// Default behaviour
peaceJS();

// Append to #footer in green theme
peaceJS('#footer');

// Will append to #header, with a blue theme (precedence over green), symbol style
// and won't link back to the project :(
peaceJS({
  target: '#header',
   theme: 'blue',
   style: 'symbol',
    link: false
});
</script>
```

## Hosting it yourself

**PEACE.JS** loads its stylesheet from the same place as the script, by swapping `.js` for `.css`: `peace.js` loads `peace.css`, and `peace.min.js` loads `peace.min.css`. So when you serve the script yourself (or install it with Bower or npm), keep the matching stylesheet next to it. When the script is bundled into another file, or loaded by package name without a file (like `https://cdn.jsdelivr.net/npm/peace.js`), the stylesheet comes from jsDelivr.

## Development

The tests run **PEACE.JS** in a real browser (Chromium, via [Playwright](https://playwright.dev)), checking the banner's colors on light, dark and see-through pages, and every option. A size test also keeps `peace.js` under its budget once minified and gzipped.

```sh
npm install
npx playwright install chromium
npm test
```

## Share peace

Using **PEACE.JS**? Make a pull request to be listed [here](SHARE.md).
