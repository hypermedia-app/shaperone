import { LitElement, css, html, TemplateResult } from 'lit'
import { spread } from '@hydrofoil/shaperone-wc/lib/spread.js'

type Constructor = new (...args: any[]) => LitElement

export interface SelectableMenu {
  createItem(item: {text: string; selected: boolean; icon?: string} & Record<string, unknown>): TemplateResult
}

type ReturnConstructor = new (...args: any[]) => LitElement & SelectableMenu

export function SelectableMenuMixin<Base extends Constructor>(base: Base): ReturnConstructor {
  class SelectableMenuClass extends base implements SelectableMenu {
    static get styles() {
      return css`mwc-list-item[selectable]:not([selected]) mwc-icon {
        display: none
      }`
    }

    createItem({ text, icon, selected, ...rest }: {text: string; selected: boolean; icon: string} & Record<string, unknown>) {
      return html`<mwc-list-item selectable graphic="icon" ?selected="${selected}" ${spread(rest)}>
        <mwc-icon slot="graphic">${icon || 'check'}</mwc-icon>
        ${text}
    </mwc-list-item>`
    }
  }

  return SelectableMenuClass
}
