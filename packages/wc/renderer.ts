import type { FocusNodeState, Dispatch } from '@hydrofoil/shaperone-core/state'
import { TemplateResult } from 'lit-html'
import type { CSSResult, CSSResultArray } from 'lit-element'
import * as strategy from './lib/renderer'
import { EditorFactory, EditorMap } from './lib/components'
import { NamedNode } from 'rdf-js'

export interface Renderer {
  components: Map<NamedNode, EditorFactory>
  strategy: {
    form: strategy.FormRenderStrategy
    group: strategy.GroupRenderStrategy
    property: strategy.PropertyRenderStrategy
    object: strategy.ObjectRenderStrategy
    editor: strategy.EditorRenderStrategy
  }
  render(params: { state: FocusNodeState; actions: Dispatch['form'] }): TemplateResult
  styles: CSSResult | CSSResultArray
}

export const DefaultRenderer: Renderer = {
  components: new EditorMap(),
  strategy: {
    form: strategy.defaultFormRenderer,
    group: strategy.defaultGroupRenderer,
    property: strategy.defaultPropertyRenderer,
    object: strategy.defaultObjectRenderer,
    editor: strategy.defaultEditorRender,
  },

  render({ state, actions }: { state: FocusNodeState; actions: Dispatch['form'] }): TemplateResult {
    const { focusNode } = state

    return this.strategy.form(state, (group, properties) => {
      return this.strategy.group(group, properties, property => {
        return this.strategy.property(property, object => {
          return this.strategy.object(object, () => {
            return this.strategy.editor(this.components, property, object, {
              update(newValue) {
                actions.updateObject({
                  focusNode,
                  property,
                  oldValue: object.object.term,
                  newValue,
                })
              },
            })
          }, {
            selectEditor(editor): void {
              actions.selectEditor({
                focusNode,
                property,
                value: object.object.term,
                editor,
              })
            },
            remove(): void {
              actions.removeObject({ focusNode, property, object })
            },
          })
        }, {
          addObject() {
            actions.addObject({ focusNode, property })
          },
        })
      })
    })
  },

  get styles() {
    return [
      this.strategy.form.styles || [],
      this.strategy.group.styles || [],
      this.strategy.property.styles || [],
      this.strategy.object.styles || [],
    ]
  },
}
