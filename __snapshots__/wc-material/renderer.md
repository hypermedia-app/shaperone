# `wc-material/renderer`

## `focusNode`

####   `does not render shape selector when there is only one shape`

```html
<mwc-list part="focus-node-header">
  <mwc-list-item twoline="">
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
<mwc-item-lite
  has-options=""
  part="editor"
>
  <mwc-editor-toggle
    part="editor-options"
    slot="options"
    title="Select editor"
  >
  </mwc-editor-toggle>
</mwc-item-lite>

```

####   `does not render a menu when there is more than one editor but switching is disabled`

```html
<mwc-item-lite part="editor">
</mwc-item-lite>

```

####   `renders a delete button when there is one editor`

```html
<mwc-item-lite
  has-options=""
  part="editor"
>
  <mwc-icon
    part="editor-options"
    slot="options"
    title="Remove value"
  >
    remove_circle
  </mwc-icon>
</mwc-item-lite>

```

####   `does not render remove button when property has minimum required values`

```html
<mwc-item-lite part="editor">
</mwc-item-lite>

```

## `property`

####   `renders a selection menu when multi editor is available but not selected`

```html
<mwc-list part="property">
  <mwc-list-item
    hasmeta=""
    part="property-header"
  >
    <b>
      property
    </b>
    <mwc-property-menu
      part="property-options"
      slot="meta"
    >
    </mwc-property-menu>
  </mwc-list-item>
  <mwc-item-lite part="property-options">
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
<mwc-list part="property">
  <mwc-list-item
    hasmeta=""
    part="property-header"
  >
    <b>
      property
    </b>
  </mwc-list-item>
</mwc-list>

```

