import type { Lazy } from '@hydrofoil/shaperone-core'
import * as Core from '@hydrofoil/shaperone-core/components.js'
import { dash } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import isGraphPointer from 'is-graph-pointer'
import type { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import type { GraphPointer } from 'clownface'
import { renderItem } from '../lib/components.js'
import { settings } from '../settings.js'

export interface AutoCompleteEditor extends Core.AutoCompleteEditor {
  initLabel(arg: SingleEditorRenderParams): void
}

declare module '@hydrofoil/shaperone-core/components.js' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface AutoComplete {
    selected?: GraphPointer
  }
}

export const autocomplete: Lazy<AutoCompleteEditor> = {
  ...Core.instancesSelect,
  editor: dash.AutoCompleteEditor,
  async lazyRender() {
    await import('../elements/sh-sl-autocomplete.js')

    return (params, { update, clear }) => {
      const { value, property, form } = params
      const pointers = value.componentState.instances || []
      const freetextQuery = value.componentState.freetextQuery || ''
      const { selected, loading } = value.componentState

      const search = (e: CustomEvent) => {
        params.updateComponentState({
          freetextQuery: e.detail.value,
        })
      }

      const itemSelected = (e: CustomEvent) => {
        const selected = pointers.find(({ value }) => value === e.detail.value)

        params.updateComponentState({
          selected,
        })
        if (selected) {
          update(selected.term)
        }
      }

      let nodeValue = ''
      if (isGraphPointer.isNamedNode(value.object)) {
        const nodeUrl = new URL(value.object.value)
        nodeValue = nodeUrl.hash || nodeUrl.pathname
      }
      const fallback = nodeValue || freetextQuery
      const clearable = property.shape.getBoolean(params.env.ns.sh1.clearable)

      return html`
        <sh-sl-autocomplete .selected=${selected}
                            .inputValue=${localizedLabel(selected, { property: form.labelProperties, fallback }) as any}
                            @search=${search}
                            .clearable="${clearable}"
                            @cleared="${clear}"
                            @itemSelected=${itemSelected}
                            .readonly="${property.shape.readOnly || false}"
                            .hoist="${settings.hoist}"
                            ?loading="${loading || false}"
        >
          ${repeat(pointers, renderItem(form.labelProperties))}
        </sh-sl-autocomplete>`
    }
  },
  initLabel(this: AutoCompleteEditor, { env, property: { shape }, value, updateComponentState }) {
    const {
      object,
      componentState: { freetextQuery, selectionLoading, selected },
    } = value

    if (object && !selected && !freetextQuery && !selectionLoading) {
      const selectionLoading = this.loadInstance({ env, property: shape, value: object })
        .then((resource) => {
          updateComponentState({
            selected: resource,
          })
        }).finally(() => {
          updateComponentState({
            loading: false,
          })
        })

      updateComponentState({ selectionLoading, loading: true })
    }
  },
  init(...args) {
    Core.instancesSelect.init?.call(this, ...args)

    this.initLabel(args[0])

    return true
  },
}
