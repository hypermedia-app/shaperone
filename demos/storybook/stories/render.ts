import type { GraphPointer } from 'clownface'
import type { WebComponentsRenderer } from '@storybook/web-components'
import type { ArgsStoryFn } from '@storybook/csf'
import { html } from 'lit'

import '../lib/shaperone-demo.js'

interface Args {
  focusNode?: string
  prefixes?: string
  shapes?: string
  data?: string
  debug?: boolean
}

const render: ArgsStoryFn<WebComponentsRenderer, Args> = function ({ focusNode, prefixes, debug, ...raw }: Args, { loaded: { shapes, data, configure } }) {
  let resource: GraphPointer | undefined
  if (focusNode) {
    resource = data.namedNode(focusNode)
  }
  return html`
    <shaperone-demo .prefixes="${prefixes}" .shapesGraph="${raw.shapes}" .dataGraph="${raw.data}">
      <shaperone-form .shapes="${shapes}" .resource="${resource}" .configuration="${configure}" ?debug="${debug}"></shaperone-form>
    </shaperone-demo>`
}

export { render }
