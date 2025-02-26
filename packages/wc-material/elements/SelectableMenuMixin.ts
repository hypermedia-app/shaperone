import type { LitElement, TemplateResult } from 'lit'
import { css, html } from 'lit'
import { spread } from '@open-wc/lit-helpers'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import type{ GraphPointer } from 'clownface'

type Constructor = new (...args: any[]) => LitElement

interface Item {
  pointer?: GraphPointer
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

    createItem({ pointer, icon, selected, ...rest }: Item & Record<string, unknown>) {
      return html`<mwc-list-item selectable graphic="icon" ?selected="${selected}" ${spread(rest)}>
        <mwc-icon slot="graphic">${icon || 'check'}</mwc-icon>
        ${localizedLabel(pointer, { fallback: pointer?.value })}
    </mwc-list-item>`
    }
  }

  return SelectableMenuClass
}
