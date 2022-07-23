import { decorate, FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html } from '@hydrofoil/shaperone-wc'
import { LogicalConstraint } from '@hydrofoil/shaperone-core/models/forms'
import type { Shape } from '@rdfine/shacl'
import { Term } from 'rdf-js'
import { localizedLabel } from '@rdfjs-elements/lit-helpers/localizedLabel.js'

const selectedShapes = new WeakMap<Term, Shape>()

function renderDropdown(shapeSelected: (xone: LogicalConstraint, shape: Shape) => void) {
  return (xone: LogicalConstraint) => {
    function onInput(e: any) {
      shapeSelected(xone, xone.shapes[(e.target).selectedIndex])
    }

    return html`<select @input="${onInput}">
      ${xone.shapes.map(shape => html`<option>${localizedLabel(shape, { fallback: shape.id.value })}</option>`)}
    </select>`
  }
}

/**
 * This function decorates a {@link FocusNodeTemplate} by rendering select menus for every `sh:xone` logical
 * constraint found on the node shape. By switching the selected item in the dropdown, all properties within a
 * `sh:xone` group will be hidden with the exception of the one selected.
 *
 * Hiding supports property shapes as well as node shapes which group multiple properties
 *
 * @param focusNodeTemplate
 */
export const focusNode = decorate((focusNodeTemplate: FocusNodeTemplate) => (context, args) => {
  const { focusNode: { logicalConstraints: { xone } }, actions } = context

  for (const group of xone) {
    // on initial render make sure that only the first shape from every
    // sh:xone is shown and hide the rest
    // using a WeakMap to prevent memory leaking when the form is removed from the page
    const selectedShape = selectedShapes.get(group.term.term)
    if (!selectedShape) {
      const [first, ...rest] = group.shapes
      actions.showProperty(first)
      rest.forEach(shape => actions.hideProperty(shape))

      selectedShapes.set(group.term.term, group.shapes[0])
    }
  }

  function select(xone: LogicalConstraint, shape: Shape) {
    // when a shape is selected from, hide all properties
    xone.shapes.forEach(shape => actions.hideProperty(shape))
    // and then show then show the selected
    actions.showProperty(shape)
  }

  return html`
      ${xone.map(renderDropdown(select))}
      ${focusNodeTemplate(context, args)}`
})
