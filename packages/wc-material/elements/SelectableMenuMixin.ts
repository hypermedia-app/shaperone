import { LitElement, css, html, TemplateResult } from 'lit'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread'
import type { NodeShape } from '@rdfine/shacl'
import { taggedLiteral } from '@rdfjs-elements/lit-helpers/taggedLiteral.js'

type Constructor = new (...args: any[]) => LitElement

interface Item {
  shape: NodeShape
  selected: boolean
  icon?: string
}

export interface SelectableMenu {
  createItem(item: Item & Record<string, unknown>): TemplateResult
}

type ReturnConstructor = new (...args: any[]) => LitElement & SelectableMenu

export function SelectableMenuMixin<Base extends Constructor>(base: Base): ReturnConstructor {
  class SelectableMenuClass extends base implements SelectableMenu {
    static get styles() {
      return css`mwc-list-item[selectable]:not([selected]) mwc-icon {
        display: none
      }`
    }

    createItem({ shape, icon, selected, ...rest }: Item & Record<string, unknown>) {
      return html`<mwc-list-item selectable graphic="icon" ?selected="${selected}" ${spread(rest)}>
        <mwc-icon slot="graphic">${icon || 'check'}</mwc-icon>
        ${taggedLiteral(shape, { fallback: shape?.id.value })}
    </mwc-list-item>`
    }
  }

  return SelectableMenuClass
}
