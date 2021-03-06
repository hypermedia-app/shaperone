# `wc-vaadin/components/instancesSelect`

#### `renders an vaadin-select`

```html
<vaadin-select-text-field
  has-value=""
  tabindex="0"
>
  <slot
    name="prefix"
    slot="prefix"
  >
  </slot>
  <slot
    name="helper"
    slot="helper"
  >
  </slot>
  <div
    part="value"
    slot=""
  >
  </div>
  <div
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-label="Toggle"
    part="toggle-button"
    role="button"
    slot="suffix"
  >
  </div>
</vaadin-select-text-field>
<vaadin-select-overlay>
  <vaadin-list-box
    aria-orientation="vertical"
    role="listbox"
  >
    <vaadin-item
      aria-selected="false"
      role="option"
      tabindex="0"
    >
      Foo I
    </vaadin-item>
    <vaadin-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      Bar I
    </vaadin-item>
  </vaadin-list-box>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>

```

#### `renders empty vaadin-select when there are no choices`

```html
<vaadin-select-text-field
  has-value=""
  tabindex="0"
>
  <slot
    name="prefix"
    slot="prefix"
  >
  </slot>
  <slot
    name="helper"
    slot="helper"
  >
  </slot>
  <div
    part="value"
    slot=""
  >
  </div>
  <div
    aria-expanded="false"
    aria-haspopup="listbox"
    aria-label="Toggle"
    part="toggle-button"
    role="button"
    slot="suffix"
  >
  </div>
</vaadin-select-text-field>
<vaadin-select-overlay>
  <vaadin-list-box
    aria-orientation="vertical"
    role="listbox"
  >
  </vaadin-list-box>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>

```

