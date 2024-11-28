import type { Meta, StoryObj as Story } from '@storybook/web-components'
import { configure } from '@hydrofoil/shaperone-wc'
import firstLast from '../shapes/simple/first-last.ttl?raw'
import unrestricted from '../shapes/simple/unrestricted.ttl?raw'
import johnDoe from '../data/simple/john-doe.ttl?raw'
import datatypes from '../shapes/simple/datatypes.ttl?raw'
import { render } from './render.js'

const config = configure()

/**
 * The examples below demonstrate the basic usage of the `shaperone-form` component, without any customisation.
 */
const meta: Meta = {
  component: 'my-component',
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
    async () => ({ config }),
  ],
  render,
}

/**
 * Given a resource ([Focus Node](https://www.w3.org/TR/shacl/#focusNodes)) from the data graph,
 * the form will be prepopulated with the data. The shape is selected based on its [targets](https://www.w3.org/TR/shacl/#targets).
 */
export const DataGraph: Story = {
  name: 'Existing data graph',
  args: {
    shapes: firstLast,
    data: johnDoe,
    focusNode: 'http://example.org/john',
  },
  loaders: [
    async () => ({ config }),
  ],
  render,
}

export const UnrestrictedProperties: Story = {
  name: 'Unrestricted property counts',
  args: {
    shapes: unrestricted,
    data: johnDoe,
    focusNode: 'http://example.org/john',
  },
  loaders: [
    async () => ({ config }),
  ],
  render,
}

/**
 * Editors are selected automatically based on the datatype and other characteristics of the property.
 */
export const Datatypes: Story = {
  name: 'Datatypes',
  args: {
    shapes: datatypes,
    prefixes: 'schema,xsd,rdf',
  },
  loaders: [
    async () => ({ config }),
  ],
  render,
}
