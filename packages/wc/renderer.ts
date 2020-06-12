import type { FormState, Dispatch } from '@hydrofoil/shaperone-core/state'
import { TemplateResult } from 'lit-html'
import { html } from 'lit-element'
import type { CSSResult, CSSResultArray } from 'lit-element'
import * as strategy from './lib/renderer'
import { EditorMap } from './EditorMap'
import { Term } from 'rdf-js'
import { dash, FocusNode } from '@hydrofoil/shaperone-core'

interface RenderParams {
  state: FormState
  focusNode: FocusNode
  actions: Dispatch['form']
}

export interface Renderer {
  components: EditorMap
  strategy: {
    form: strategy.FormRenderStrategy
    group: strategy.GroupRenderStrategy
    property: strategy.PropertyRenderStrategy
    object: strategy.ObjectRenderStrategy
    initialising: strategy.InitialisationStrategy
  }
  render(params: RenderParams): TemplateResult
  styles: CSSResult | CSSResultArray
  loadDependencies(): Promise<void>
  ready: boolean
}

export const DefaultRenderer: Renderer = {
  ready: false,
  components: new EditorMap(),
  strategy: {
    form: strategy.defaultFormRenderer,
    group: strategy.defaultGroupRenderer,
    property: strategy.defaultPropertyRenderer,
    object: strategy.defaultObjectRenderer,
    initialising() {
      return 'Initialising form'
    },
  },

  render({ state, actions, focusNode }: RenderParams): TemplateResult {
    const focusNodeState = state.focusNodes[focusNode.value]

    if (!focusNodeState) {
      return html``
    }

    return this.strategy.form(focusNodeState, (group, properties) => {
      return this.strategy.group(group, properties, property => {
        return this.strategy.property(property, value => {
          return this.strategy.object(value, () => {
            function update(newValue: Term) {
              actions.updateObject({
                focusNode,
                property: property.shape,
                oldValue: value.object.term,
                newValue,
              })
            }

            const editor = value.selectedEditor || dash.TextFieldEditor
            const component = this.components.get(editor)
            if (!component) {
              return html`No editor found for property`
            }

            if (component.loadDependencies) {
              const editorState = state.editors[editor.value]
              if (!editorState) {
                actions.loadEditor({
                  editor,
                  imports: component.loadDependencies(),
                })
              }

              if (!editorState || !editorState.loaded) {
                return html`Loading editor`
              }
            }

            return component.render({
              property,
              value,
              update,
            })
          }, {
            selectEditor(editor): void {
              actions.selectEditor({
                focusNode,
                property: property.shape,
                value: value.object.term,
                editor,
              })
            },
            remove(): void {
              actions.removeObject({ focusNode, property: property.shape, object: value })
            },
          })
        }, {
          addObject() {
            actions.addObject({ focusNode, property: property.shape })
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

  async loadDependencies() {
    await Promise.all(
      Object.values(this.strategy).reduce<Array<Promise<unknown>>>((promises, strat) => {
        if (!strat.loadDependencies) return promises

        return [...promises, ...strat.loadDependencies()]
      }, []),
    )

    this.ready = true
  },
}
