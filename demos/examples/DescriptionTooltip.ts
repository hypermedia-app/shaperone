import { TemplateResult } from 'lit-element'
import { html } from '@hydrofoil/shaperone-wc'
import { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { PropertyShape } from '@rdfine/shacl'

function wrap(shape: PropertyShape, result: TemplateResult) {
  if (shape.description) {
    return html`<div title="${shape.description}">${result}</div>`
  }

  return result
}

export const DescriptionTooltip: ComponentDecorator = {
  applicableTo() {
    return true
  },
  decorate(component) {
    if ('lazyRender' in component) {
      return {
        ...component,
        lazyRender: async () => {
          const render = await component.lazyRender()
          return function (params) {
            return wrap(params.property.shape, render.call(this, params))
          }
        },
      }
    }

    return {
      ...component,
      render(params) {
        return wrap(params.property.shape, component.render(params))
      },
    }
  },
}
