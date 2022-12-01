import { Lazy } from '@hydrofoil/shaperone-core'
import * as Core from '@hydrofoil/shaperone-core/components.js'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import isGraphPointer from 'is-graph-pointer'
import { NamedNode } from 'rdf-js'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import type { GraphPointer } from 'clownface'
import sh1 from '@hydrofoil/shaperone-core/ns'
import { renderItem } from '../lib/components.js'
import { settings } from '../settings.js'

interface Options {
  labelProperties: NamedNode | NamedNode[]
}

export interface AutoCompleteEditor extends Core.AutoCompleteEditor {
  initLabel(arg: SingleEditorRenderParams): void
}

declare module '@hydrofoil/shaperone-core/components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface AutoComplete {
    selected?: GraphPointer
  }
}

export const autocomplete: Lazy<AutoCompleteEditor> & Options = {
  ...Core.instancesSelect,
  labelProperties: rdfs.label,
  editor: dash.AutoCompleteEditor,
  async lazyRender() {
    await import('../elements/sh-sl-autocomplete.js')

    return (params, { update, clear }) => {
      const { value, property } = params
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
      const clearable = property.shape.getBoolean(sh1.clearable)

      return html`
        <sh-sl-autocomplete .selected=${selected}
                            .inputValue=${localizedLabel(selected, { property: autocomplete.labelProperties, fallback })}
                            @search=${search}
                            .clearable="${clearable}"
                            @cleared="${clear}"
                            @itemSelected=${itemSelected}
                            .readonly="${property.shape.readOnly || false}"
                            .hoist="${settings.hoist}"
                            ?loading="${loading || false}"
        >
          ${repeat(pointers, renderItem)}
        </sh-sl-autocomplete>`
    }
  },
  initLabel(this: AutoCompleteEditor, { property: { shape }, value, updateComponentState }) {
    const {
      object,
      componentState: { freetextQuery, selectionLoading, selected },
    } = value

    if (object && !selected && !freetextQuery && !selectionLoading) {
      const selectionLoading = this.loadInstance({ property: shape, value: object })
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
