import type {
  PropertyState,
  FocusNodeState,
  PropertyGroupState,
  PropertyObjectState,
} from '@hydrofoil/shaperone-core/models/forms'
import { html, TemplateResult } from 'lit-element'
import { NamedNode, Term } from 'rdf-js'
import { FocusNode } from '@hydrofoil/shaperone-core'
import { byGroup } from '@hydrofoil/shaperone-core/lib/filter'
import type { NodeShape, PropertyGroup } from '@rdfine/shacl'
import type { Renderer, RenderParams } from './renderer/index'

export const DefaultRenderer: Renderer = {
  render({ form, state, components, actions, strategy }: RenderParams): TemplateResult {
    const { editors } = form

    const formRenderActions = {
      truncateFocusNodes: (focusNode: FocusNode) => actions.forms.truncateFocusNodes({ form, focusNode }),
      popFocusNode: () => actions.forms.popFocusNode({ form }),
    }

    const renderFocusNode = (focusNodeState: FocusNodeState) => {
      const { focusNode } = focusNodeState
      const focusNodeActions = {
        ...formRenderActions,
        selectGroup: (group: PropertyGroup | undefined) => actions.forms.selectGroup({ form, focusNode, group }),
        selectShape: (shape: NodeShape) => actions.forms.selectShape({ form, focusNode, shape }),
      }

      const renderGroup = (groupState: PropertyGroupState) => {
        const properties = focusNodeState.properties.filter(byGroup(groupState?.group))
        const groupRenderActions = {
          selectGroup: () => actions.forms.selectGroup({ form, focusNode, group: groupState?.group }),
        }

        const renderProperty = (property: PropertyState) => {
          const propertyRenderActions = {
            addObject: () => actions.forms.addObject({ form, focusNode, property: property.shape }),
          }

          const renderObject = (value: PropertyObjectState) => {
            const objectRenderActions = {
              selectEditor(editor: NamedNode): void {
                actions.forms.selectEditor({
                  form,
                  focusNode,
                  property: property.shape,
                  value: value.object.term,
                  editor,
                })
              },
              remove(): void {
                actions.forms.removeObject({ form, focusNode, property: property.shape, object: value })
              },
            }

            const renderEditor = () => {
              function update(newValue: Term) {
                actions.forms.updateObject({
                  form,
                  focusNode,
                  property: property.shape,
                  oldValue: value.object.term,
                  newValue,
                })
              }

              function focusOnObjectNode() {
                if (value.object.term.termType === 'NamedNode' || value.object.term.termType === 'BlankNode') {
                  actions.forms.pushFocusNode({ form, focusNode: value.object as any, property: property.shape })
                }
              }

              const editor = value.selectedEditor
              if (!editor) {
                return html`No editor found for property`
              }
              const component = components[editor.value]
              if (!component) {
                return html`No component found for ${editors.allEditors[editor.value].meta.label}`
              }

              if (!component.loaded) {
                if (!component.loading) {
                  actions.components.load(editor)
                }
                return html`Loading editor`
              }

              return component.render(
                { property, value },
                { update, focusOnObjectNode },
              )
            }

            return strategy.object({
              object: value,
              actions: objectRenderActions,
              renderEditor,
            })
          }

          return strategy.property({
            property,
            actions: propertyRenderActions,
            renderObject,
          })
        }

        return strategy.group({
          group: groupState,
          properties,
          actions: groupRenderActions,
          renderProperty,
        })
      }

      return strategy.focusNode({
        focusNode: focusNodeState,
        actions: focusNodeActions,
        renderGroup,
      })
    }

    return strategy.form({
      form: state,
      actions: formRenderActions,
      renderFocusNode,
    })
  },
}
