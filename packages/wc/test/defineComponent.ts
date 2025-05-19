import type { ComponentConstructor } from '@hydrofoil/shaperone-core/models/components/index.js'
import * as staticLit from 'lit/static-html.js'
import { spread } from '@open-wc/lit-helpers'
import type { TemplateResult } from 'lit'
import type { MultiEditorTestFixture, SingleEditorTestFixture } from './index.js'

interface Render {
  (params: SingleEditorTestFixture | MultiEditorTestFixture): TemplateResult
}

declare module 'mocha' {
  interface Context {
    component: {
      render: Render
    }
  }
}

export function defineComponent(component: ComponentConstructor, tagName: string) {
  return function (this: Mocha.Context) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, component)
    }

    const tag = staticLit.literal`${staticLit.unsafeStatic(tagName)}`
    this.component.render = (params) => {
      // prepend object properties of params with a dot
      const bindings = Object.entries(params).reduce((acc, [key, value]) => {
        if (key === 'object' || key === 'objects') {
          return acc
        }
        return {
          ...acc,
          [`.${key}`]: value,
        }
      }, {})
      return staticLit.html`<${tag} ${spread(bindings)}></${tag}>`
    }
  }
}
