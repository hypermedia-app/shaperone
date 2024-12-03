import type { Meta, StoryObj as Story } from '@storybook/web-components'
import * as shoelace from '@hydrofoil/shaperone-wc-shoelace/components.js'
import * as templates from '@hydrofoil/shaperone-wc-shoelace/templates.js'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import { render } from './render.js'
import firstLast from '../shapes/simple/first-last.ttl?raw'

const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(shoelace)
  renderer.setTemplates(templates)
}

const meta: Meta = {
  component: 'shaperone-form',
  argTypes: {
    focusNode: {
      control: 'text',
    },
    shape: {
      control: 'text',
    },
    prefixes: {
      control: 'text',
    },
  },
  args: {
    prefixes: 'schema',
  },
}

export default meta

/**
 * Without setting the data graph, the form will be empty and a `<>` IRI used for focus node.
 */
export const EmptyDataGraph: Story = {
  name: 'Empty data graph',
  args: {
    shapes: firstLast,
    shape: 'http://example.org/PersonShape',
  },
  loaders: [
    async () => ({
      configure,
    }),
  ],
  render,
}
