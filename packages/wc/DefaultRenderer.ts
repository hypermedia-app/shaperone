import type {
  PropertyState,
  FocusNodeState,
  PropertyGroupState,
  PropertyObjectState,
} from '@hydrofoil/shaperone-core/state/form'
import { html, TemplateResult } from 'lit-element'
import { NamedNode, Term } from 'rdf-js'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { byGroup } from '@hydrofoil/shaperone-core/lib/filter'
import { PropertyGroup } from '@rdfine/shacl'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { Renderer, RenderParams } from './renderer/index'

export const DefaultRenderer: Renderer = {
  render({ form, state, actions }: RenderParams): TemplateResult {
    const formRenderActions = {
      truncateFocusNodes: (focusNode: FocusNode) => actions.form.truncateFocusNodes({ focusNode }),
      popFocusNode: () => actions.form.popFocusNode(),
    }

    const renderFocusNode = (focusNodeState: FocusNodeState) => {
      const { focusNode } = focusNodeState
      const focusNodeActions = {
        ...formRenderActions,
        selectGroup: (group: PropertyGroup | undefined) => actions.form.selectGroup({ focusNode, group }),
      }

      const renderGroup = (groupState: PropertyGroupState) => {
        const properties = focusNodeState.properties.filter(byGroup(groupState?.group))
        const groupRenderActions = {
          selectGroup: () => actions.form.selectGroup({ focusNode, group: groupState?.group }),
        }

        const renderProperty = (property: PropertyState) => {
          const propertyRenderActions = {
            addObject: () => actions.form.addObject({ focusNode, property: property.shape, editors: state.editors }),
          }

          const renderObject = (value: PropertyObjectState) => {
            const objectRenderActions = {
              selectEditor(editor: NamedNode): void {
                actions.form.selectEditor({
                  focusNode,
                  property: property.shape,
                  value: value.object.term,
                  editor,
                })
              },
              remove(): void {
                actions.form.removeObject({ focusNode, property: property.shape, object: value })
              },
            }

            const renderEditor = () => {
              function update(newValue: Term) {
                actions.form.updateObject({
                  focusNode,
                  property: property.shape,
                  oldValue: value.object.term,
                  newValue,
                })
              }

              function pushFocusNode() {
                if (value.object.term.termType === 'NamedNode' || value.object.term.termType === 'BlankNode') {
                  actions.form.pushFocusNode({ focusNode: value.object as any, property: property.shape, editors: state.editors })
                }
              }

              const editor = value.selectedEditor || dash.TextFieldEditor
              const component = state.components[editor.value]
              if (!component) {
                return html`No editor found for property`
              }

              if (!component.loaded) {
                if (!component.loading) {
                  actions.components.load(editor)
                }
                return html`Loading editor`
              }

              return component.render(
                { property, value },
                { update, pushFocusNode },
              )
            }

            return state.renderer.strategy.object({
              object: value,
              actions: objectRenderActions,
              renderEditor,
            })
          }

          return state.renderer.strategy.property({
            property,
            actions: propertyRenderActions,
            renderObject,
          })
        }

        return state.renderer.strategy.group({
          group: groupState,
          properties,
          actions: groupRenderActions,
          renderProperty,
        })
      }

      return state.renderer.strategy.focusNode({
        focusNode: focusNodeState,
        actions: focusNodeActions,
        renderGroup,
      })
    }

    return state.renderer.strategy.form({
      form,
      actions: formRenderActions,
      renderFocusNode,
    })
  },
}
