# PEACE.JS

Add the following piece of code before the closing _</body>_ tag on your website to support **PEACE**:

```html
<script src="https://humancopy.s3.amazonaws.com/peace-js/peace.min.js" async></script>
```

*You can actually paste it where you want inside the ```<body>```. It will inject itself at the same level as the ```<script>``` tag.*

## Extra Options

By default it will show the word Peace in different languages. If you prefer instead to show a peace symbol simply add the `data-stlye="symbol"` attribute to the script tag:

```html
<script src="https://humancopy.s3.amazonaws.com/peace-js/peace.min.js" data-style="symbol" async></script>
```

You can also disable the automatic activation of the banner by adding the attribute `data-auto="false"` to the script:

```html
<script src="https://humancopy.s3.amazonaws.com/peace-js/peace.min.js" data-auto="false" async></script>
```
