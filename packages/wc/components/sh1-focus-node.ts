import { html, LitElement } from 'lit'
import type { FocusNodeState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { ifDefined } from 'lit/directives/if-defined.js'

export class Sh1FocusNode extends LitElement {
  @property({ type: Object })
  private focusNode!: FocusNodeState

  render() {
    return html`${repeat(this.focusNode.groups, group => html`<slot name="${ifDefined(group.group?.id.value)}"></slot>`)}`
  }
}
