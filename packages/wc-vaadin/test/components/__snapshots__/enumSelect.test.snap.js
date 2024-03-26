/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["wc-vaadin/components/enumSelect renders an vaadin-select"] = 
`<div class="vaadin-select-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container part="input-field">
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
      part="toggle-button"
      slot="suffix"
    >
    </div>
  </vaadin-input-container>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
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
      foo
    </vaadin-item>
    <vaadin-item
      aria-selected="false"
      role="option"
      tabindex="-1"
    >
      bar
    </vaadin-item>
  </vaadin-list-box>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot wc-vaadin/components/enumSelect renders an vaadin-select */

snapshots["wc-vaadin/components/enumSelect renders empty vaadin-select when there are no choices"] = 
`<div class="vaadin-select-container">
  <div part="label">
    <slot name="label">
    </slot>
    <span
      aria-hidden="true"
      part="required-indicator"
    >
    </span>
  </div>
  <vaadin-input-container part="input-field">
    <slot
      name="prefix"
      slot="prefix"
    >
    </slot>
    <slot name="value">
    </slot>
    <div
      aria-hidden="true"
      part="toggle-button"
      slot="suffix"
    >
    </div>
  </vaadin-input-container>
  <div part="helper-text">
    <slot name="helper">
    </slot>
  </div>
  <div part="error-message">
    <slot name="error-message">
    </slot>
  </div>
</div>
<vaadin-select-overlay>
  <vaadin-list-box
    aria-orientation="vertical"
    role="listbox"
  >
  </vaadin-list-box>
</vaadin-select-overlay>
<iron-media-query style="display: none;">
</iron-media-query>
`;
/* end snapshot wc-vaadin/components/enumSelect renders empty vaadin-select when there are no choices */

