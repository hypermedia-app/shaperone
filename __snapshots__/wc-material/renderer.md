# `wc-material/renderer`

## `focusNode`

####   `does not render shape selector when there is only one shape`

```html
<mwc-list>
  <mwc-list-item twoline="">
    http://example.com/Foo
    <span slot="secondary">
    </span>
    <mwc-shape-selector
      slot="meta"
      title="Select shape"
    >
    </mwc-shape-selector>
  </mwc-list-item>
</mwc-list>

```

## `object`

####   `renders a menu when there is more than one editor`

```html
<div class="sh-object">
  <div class="editor">
  </div>
  <div class="options">
    <mwc-editor-toggle title="Select editor">
    </mwc-editor-toggle>
  </div>
</div>

```

####   `renders a delete button when there is one editor`

```html
<div class="sh-object">
  <div class="editor">
  </div>
  <div class="options">
    <mwc-icon title="Remove value">
      remove_circle
    </mwc-icon>
  </div>
</div>

```

####   `does not render remove button when property has minimum required values`

```html
<div class="sh-object">
  <div class="editor">
  </div>
  <div class="options">
  </div>
</div>

```

