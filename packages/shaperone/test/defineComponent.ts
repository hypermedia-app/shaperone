import type { ComponentConstructor } from '@shaperone/core/models/components/index.js'
import * as staticLit from 'lit/static-html.js'
import { spread } from '@open-wc/lit-helpers'
import type { MultiEditorTestFixture, SingleEditorTestFixture } from '@shaperone/testing'
import { fixture, oneEvent } from '@open-wc/testing'
import type { LitElement } from 'lit'
import { getEditorTagName } from '../components/editor.js'
import type { MultiEditorComponent, SingleEditorComponent } from '../index.js'

interface Options {
  awaitEvent?: string
}

interface ElementSelected<E extends keyof HTMLElementTagNameMap> {
  element: E
}

interface Render {
  <E extends keyof HTMLElementTagNameMap>(params: SingleEditorTestFixture | MultiEditorTestFixture, options: ElementSelected<E>): Promise<{
    component: LitElement
    input: HTMLElementTagNameMap[E]
  }>
  <C extends SingleEditorComponent>(params: SingleEditorTestFixture<C>, options?: undefined): Promise<C>
  <C extends MultiEditorComponent>(params: MultiEditorTestFixture<C>, options?: undefined): Promise<C>
}

declare module 'mocha' {
  interface Context {
    component: {
      render: Render
    }
  }
}

export default function (component: ComponentConstructor, { awaitEvent }: Options = {}) {
  const tagName = getEditorTagName(component.editor)

  return function (this: Mocha.Context) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, component)
    }

    const tag = staticLit.literal`${staticLit.unsafeStatic(tagName)}`
    this.component = {
      async render(params: SingleEditorTestFixture | MultiEditorTestFixture, options?: Options | ElementSelected<any>): Promise<any> {
        // prepend object properties of params with a dot
        const { property, focusNode, ...rest } = params
        const template = staticLit.html`<${tag} .property="${property}" .focusNode="${focusNode}" ${spread(toBindings(rest))}></${tag}>`

        const result = await fixture(template)

        if (awaitEvent) {
          await oneEvent(result, awaitEvent)
        }

        if (options && 'element' in options) {
          return {
            component: result,
            input: result.shadowRoot!.querySelector(options.element),
          }
        }

        return result
      },
    }
  }
}

function toBindings(arg: Record<string, unknown>) {
  return Object.entries(arg).reduce((acc, [key, value]) => {
    if (key === 'object' || key === 'objects') {
      return acc
    }
    return {
      ...acc,
      [`.${key}`]: value,
    }
  }, {})
}
