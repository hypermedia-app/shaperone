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
<mwc-item-lite>
  <mwc-editor-toggle
    slot="options"
    title="Select editor"
  >
  </mwc-editor-toggle>
</mwc-item-lite>
```

####   `renders a delete button when there is one editor`

```html
<mwc-item-lite>
  <mwc-icon
    slot="options"
    title="Remove value"
  >
    remove_circle
  </mwc-icon>
</mwc-item-lite>
```

####   `does not render remove button when property has minimum required values`

```html
<mwc-item-lite>
</mwc-item-lite>
```

## `property`

####   `renders a selection menu when multi editor is available but not selected`

```html
<mwc-list>
  <mwc-list-item hasmeta="">
    <b>
      property
    </b>
    <mwc-property-menu slot="meta">
    </mwc-property-menu>
  </mwc-list-item>
  <mwc-item-lite>
    <i>
      Click to add value
    </i>
    <mwc-icon
      slot="options"
      title="Add value"
    >
      add_circle
    </mwc-icon>
  </mwc-item-lite>
</mwc-list>
```

####   `does not render add row when caAdd=false`

```html
<mwc-list>
  <mwc-list-item hasmeta="">
    <b>
      property
    </b>
  </mwc-list-item>
</mwc-list>

```

