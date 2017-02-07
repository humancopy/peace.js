# PEACE.JS

Add the following piece of code before the closing ```</body>``` tag on your website to support **PEACE.JS**:

```html
<script src="https://cdn.jsdelivr.net/peace.js/latest/peace.min.js" async></script>
```

*You can actually paste it where you want inside the ```<body>```. It will inject itself at the same level as the ```<script>``` tag.*

## Themes

The default color for the **PEACE.JS** is black. This can be controlled via the `data-theme` attribute. Possible values are: black, white, green & blue.

```html
<script src="https://cdn.jsdelivr.net/peace.js/latest/peace.min.js" data-theme="blue" async></script>
```

## Style

By default **PEACE.JS** will show the word Peace in different languages. If you prefer instead to show a peace symbol simply add the `data-stlye="symbol"` attribute to the script tag:

```html
<script src="https://cdn.jsdelivr.net/peace.js/latest/peace.min.js" data-style="symbol" async></script>
```

## Autoloading

You can also disable the automatic activation of the banner by adding the attribute `data-auto="false"` to the script:

```html
<script src="https://cdn.jsdelivr.net/peace.js/latest/peace.min.js" data-auto="false" async></script>
```

You can then activate it by calling the ```peaceJS()``` function anywhere in your page or javascript.