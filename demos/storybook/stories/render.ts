import type { GraphPointer } from 'clownface'
import type { WebComponentsRenderer } from '@storybook/web-components'
import type { ArgsStoryFn } from '@storybook/csf'
import { html } from 'lit'

import '../lib/shaperone-demo.js'
import type { TurtleTemplateResult } from '@tpluscode/rdf-string'
import type { NamedNode } from '@rdfjs/types'

interface Args {
  focusNode?: string | NamedNode
  prefixes?: string
  customPrefixes?: Record<string, string>
  shapes?: string
  data?: string | TurtleTemplateResult
  debug?: boolean
}

const render: ArgsStoryFn<WebComponentsRenderer, Args> = function ({ focusNode, prefixes, customPrefixes = {}, debug, ...raw }: Args, { loaded: { shapes, data, configure } }) {
  let resource: GraphPointer | undefined
  if (focusNode) {
    resource = data.namedNode(focusNode)
  }

  const rawData = raw.data?.toString()

  return html`
    <shaperone-demo .prefixes="${prefixes}" .customPrefixes="${customPrefixes}" .shapesGraph="${raw.shapes}" .dataGraph="${rawData}">
      <shaperone-form .shapes="${shapes}" .resource="${resource}" .configuration="${configure}" ?debug="${debug}"></shaperone-form>
    </shaperone-demo>`
}

export { render }
