import { html, LitElement } from 'lit'
import type { FocusNodeState } from '@hydrofoil/shaperone-core/models/forms/index.js'
import { property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import FindParentCustomElementRegistry from './FindParentCustomElementRegistry.js'

export class Sh1FocusNode extends FindParentCustomElementRegistry(LitElement) {
  @property({ type: Object })
  public focusNode!: FocusNodeState

  render() {
    return html`${repeat(this.focusNode.groups, group => html`<slot name="${ifDefined(group.group?.id.value)}"></slot>`)}`
  }
}
