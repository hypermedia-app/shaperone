import type {
  FormState,
  Dispatch,
  PropertyState,
  FocusNodeState,
  PropertyGroupState,
  PropertyObjectState,
} from '@hydrofoil/shaperone-core/state'
import { html, TemplateResult } from 'lit-element'
import type { CSSResult, CSSResultArray } from 'lit-element'
import * as strategy from './lib/renderer'
import { EditorMap } from './EditorMap'
import { NamedNode, Term } from 'rdf-js'
import { dash, FocusNode } from '@hydrofoil/shaperone-core'
import { byGroup } from '@hydrofoil/shaperone-core/lib/filter'
import { PropertyGroup } from '@rdfine/shacl'

interface RenderParams {
  state: FormState
  actions: Dispatch['form']
}

export * from './lib/renderer'

export interface Renderer {
  components: EditorMap
  strategy: {
    form: strategy.FormRenderStrategy
    focusNode: strategy.FocusNodeRenderStrategy
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

export const DefaultStrategy = {
  form: strategy.defaultFormRenderer,
  focusNode: strategy.defaultFocusNodeRenderer,
  group: strategy.defaultGroupRenderer,
  property: strategy.defaultPropertyRenderer,
  object: strategy.defaultObjectRenderer,
  initialising() {
    return 'Initialising form'
  },
}

export const DefaultRenderer: Renderer = {
  ready: false,
  components: new EditorMap(),
  strategy: DefaultStrategy,

  render({ state, actions }: RenderParams): TemplateResult {
    const formRenderActions = {
      truncateFocusNodes: (focusNode: FocusNode) => actions.truncateFocusNodes({ focusNode }),
      popFocusNode: () => actions.popFocusNode(),
    }

    const renderFocusNode = (focusNodeState: FocusNodeState) => {
      const { focusNode } = focusNodeState
      const focusNodeActions = {
        ...formRenderActions,
        selectGroup: (group: PropertyGroup | undefined) => actions.selectGroup({ focusNode, group }),
      }

      const renderGroup = (groupState: PropertyGroupState) => {
        const properties = focusNodeState.properties.filter(byGroup(groupState?.group))
        const groupRenderActions = {
          selectGroup: () => actions.selectGroup({ focusNode, group: groupState?.group }),
        }

        const renderProperty = (property: PropertyState) => {
          const propertyRenderActions = {
            addObject: () => actions.addObject({ focusNode, property: property.shape }),
          }

          const renderObject = (value: PropertyObjectState) => {
            const objectRenderActions = {
              selectEditor(editor: NamedNode): void {
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
            }

            const renderEditor = () => {
              function update(newValue: Term) {
                actions.updateObject({
                  focusNode,
                  property: property.shape,
                  oldValue: value.object.term,
                  newValue,
                })
              }

              function pushFocusNode() {
                if (value.object.term.termType === 'NamedNode' || value.object.term.termType === 'BlankNode') {
                  actions.pushFocusNode({ focusNode: value.object as any, property: property.shape })
                }
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

              return component.render(
                { property, value },
                { update, pushFocusNode },
              )
            }

            return this.strategy.object({
              object: value,
              actions: objectRenderActions,
              renderEditor,
            })
          }

          return this.strategy.property({
            property,
            actions: propertyRenderActions,
            renderObject,
          })
        }

        return this.strategy.group({
          group: groupState,
          properties,
          actions: groupRenderActions,
          renderProperty,
        })
      }

      return this.strategy.focusNode({
        focusNode: focusNodeState,
        actions: focusNodeActions,
        renderGroup,
      })
    }

    return this.strategy.form({
      form: state,
      actions: formRenderActions,
      renderFocusNode,
    })
  },

  get styles() {
    return [
      this.strategy.form.styles || [],
      this.strategy.focusNode.styles || [],
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
