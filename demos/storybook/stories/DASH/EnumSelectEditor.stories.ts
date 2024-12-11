import type { Meta, StoryObj as Story } from '@storybook/web-components'
import { render } from '../render.js'

/**
 * The enum selector is typically rendered as a dropdown menu with a set of choices which a SHACL [`PropertyShape`](https://www.w3.org/TR/shacl/#property-shapes) declares by using the [`sh:in` constraint](https://www.w3.org/TR/shacl/#InConstraintComponent)
 *
 * The default behaviour is to present literal values directly and enumeration of resources (named nodes or blank nodes) will use any `rdfs:label` value found in the **shapes graph**
 */
const meta: Meta = {

}

export default meta

export const EmptyDataGraph: Story = {
  name: 'TBD',
  args: {
    shape: 'http://example.org/PersonShape',
  },
  render,
}
