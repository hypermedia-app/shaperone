import { LitElement, html, css, customElement } from 'lit-element'

@customElement('mwc-item-lite')
export class MwcItemLite extends LitElement {
  static get styles() {
    return css`
:host {
  display: flex;
  min-height: 48px;
  align-items: center;
  padding-left: var(--mdc-list-side-padding, 16px);
  padding-right: var(--mdc-list-side-padding, 16px);
  color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
}

#main {
  display: flex;
  flex: 1;
}

slot::slotted(*) {
  flex: 1;
}

#options {
  padding-top: 5px;
  width: 30px;
  padding-left: 5px;
  text-align: right;
}

slot[name=options]::slotted(mwc-icon) {
  cursor: pointer
}`
  }

  render() {
    return html`
    <div id="main"><slot></slot></div>
    <div id="options"><slot name="options"></slot></div>`
  }
}
