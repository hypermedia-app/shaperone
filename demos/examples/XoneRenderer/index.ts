import { FocusNodeTemplate } from '@hydrofoil/shaperone-wc/templates'
import { html } from 'lit-html'
import { LogicalConstraint } from '@hydrofoil/shaperone-core/models/forms'
import type { Shape } from '@rdfine/shacl'
import TermMap from '@rdf-esm/term-map'
import { Term } from 'rdf-js'

const selectedShapes = new TermMap<Term, Shape>()

function renderDropdown(onSelected: (xone: LogicalConstraint, shape: Shape) => void) {
  return function (xone: LogicalConstraint) {
    return html`<select @input="${(e: any) => onSelected(xone, xone.shapes[(e.target).selectedIndex])}">
      ${xone.shapes.map(shape => html`<option>${shape.label || shape.id.value}</option>`)}
    </select>`
  }
}

export function focusNode(focusNodeTemplate: FocusNodeTemplate): FocusNodeTemplate {
  const renderer: FocusNodeTemplate = function (context, args) {
    const { focusNode: { logicalConstraints: { xone } }, actions } = context

    for (const group of xone) {
      const selectedShape = selectedShapes.get(group.term.term)
      if (!selectedShape) {
        group.shapes.forEach(shape => actions.hideProperty(shape))
        actions.showProperty(group.shapes[0])
        selectedShapes.set(group.term.term, group.shapes[0])
      }
    }

    function select(xone: LogicalConstraint, shape: Shape) {
      xone.shapes.forEach(shape => actions.hideProperty(shape))
      actions.showProperty(shape)
    }

    return html`
      ${xone.map(renderDropdown(select))}
      ${focusNodeTemplate(context, args)}`
  }

  renderer.loadDependencies = focusNodeTemplate.loadDependencies

  return renderer
}
