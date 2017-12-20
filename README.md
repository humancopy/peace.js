# PEACE.JS

Add the following piece (no pun intended) of code before the closing ```</body>``` tag on your website to promote **PEACE.JS**:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.1.6/dist/peace.min.js" async></script>
```

*You can actually paste it anywhere inside the ```<body>```. It will inject itself at the same DOM level as the ```<script>``` tag.*

## Target

By default **PEACE.JS** will be appeneded to the parent element of the ```<script>``` tag. If you'd like to inject it somewhere else simply add the `data-target` attribute:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.1.6/dist/peace.min.js" data-target="#footer" async></script>
```

## Themes

The default text color for **PEACE.JS** is black. This can be controlled via the `data-theme` attribute. Possible values are: black, white, green & blue.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.1.6/dist/peace.min.js" data-theme="blue" async></script>
```

## Style

By default **PEACE.JS** will show the word Peace in different languages. If you prefer instead to show a peace symbol simply add the `data-stlye="symbol"` attribute to the script tag:

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.1.6/dist/peace.min.js" data-style="symbol" async></script>
```

## Autoloading

You can also disable the automatic activation of the banner by adding the attribute `data-auto="false"` to the script. You can then activate it by calling the ```peaceJS()``` function.

The ```peaceJS()``` function accepts an optional argument of either a hash of options, DOM element, DOM selector or jQuery object. Any option passed to ```peaceJS()``` has precedence over what was defined on the ```<script>``` tag.

```html
<script src="https://cdn.jsdelivr.net/npm/peace.js@1.1.6/dist/peace.min.js" data-auto="false" data-theme="green" async></script>

<script>
// Default behaviour
peaceJS();

// Append to #footer in green theme
peaceJS('#footer');

// Same as above but a jQuery object
peaceJS($('#footer'));

// Will append to #header, with a blue theme (precedence over green) and symbol style
peaceJS({
  target: '#header',
   theme: 'blue',
   style: 'symbol'
});
</script>
```
