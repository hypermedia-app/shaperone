import { Lazy } from '@hydrofoil/shaperone-core'
import * as Core from '@hydrofoil/shaperone-core/components.js'
import { dash, rdfs } from '@tpluscode/rdf-ns-builders'
import { html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'
import { isNamedNode } from 'is-graph-pointer'
import { NamedNode } from 'rdf-js'
import { SingleEditorRenderParams } from '@hydrofoil/shaperone-core/models/components'
import { renderItem } from '../lib/components'

interface Options {
  labelProperties: NamedNode | NamedNode[]
}

interface AutoCompleteEditor extends Core.AutoCompleteEditor {
  initLabel(arg: SingleEditorRenderParams): void
}

export const autocomplete: Lazy<AutoCompleteEditor> & Options = {
  ...Core.instancesSelect,
  labelProperties: rdfs.label,
  editor: dash.AutoCompleteEditor,
  async lazyRender() {
    await import('../components/sh-sl-autocomplete.js')

    return (params, { update }) => {
      const { value } = params
      const pointers = value.componentState.instances || []
      const freetextQuery = value.componentState.freetextQuery || ''
      const { selected } = value.componentState

      const search = (e: CustomEvent) => {
        params.updateComponentState({
          freetextQuery: e.detail.value,
        })
      }

      const itemSelected = (e: CustomEvent) => {
        const selected = pointers.find(({ value }) => value === e.detail.value)

        params.updateComponentState({
          freetextQuery: '',
          selected,
        })
        if (selected) {
          update(selected.term)
        }
      }

      let nodeValue = value.object?.value
      if (isNamedNode(value.object)) {
        const nodeUrl = new URL(value.object.value)
        nodeValue = nodeUrl.hash || nodeUrl.pathname
      }
      const fallback = nodeValue || freetextQuery

      return html`
        <sh-sl-autocomplete .selected=${selected}
                            .inputValue=${localizedLabel(selected, { property: autocomplete.labelProperties, fallback })}
                            @search=${search}
                            @itemSelected=${itemSelected}>
          ${repeat(pointers, renderItem)}
        </sh-sl-autocomplete>`
    }
  },
  initLabel(this: AutoCompleteEditor, { property: { shape }, value, updateComponentState }) {
    const {
      object,
      componentState: { freetextQuery, selectionLoading },
    } = value

    if (object && !freetextQuery && !selectionLoading) {
      const selectionLoading = this.loadInstance({ property: shape, value: object })
        .then((resource) => {
          updateComponentState({
            selected: resource,
          })
        })

      updateComponentState({ selectionLoading })
    }
  },
  init(...args) {
    Core.instancesSelect.init?.call(this, ...args)

    this.initLabel(args[0])

    return true
  },
}
