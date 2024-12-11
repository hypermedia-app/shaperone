import type { Meta, StoryObj as Story } from '@storybook/web-components'
import { render } from '../render.js'
import enumStrings from '../../shapes/editors/dash/EnumSelect/strings.ttl?raw'
import enumIris from '../../shapes/editors/dash/EnumSelect/iris.ttl?raw'

/**
 * Examples of using the dash:EnumSelectEditor
 */
const meta: Meta = {
  component: 'shaperone-form',
}

export default meta

/**
 * Values can be provided as literals using the `sh:in` property
 */
export const Literals: Story = {
  name: 'sh:in choice of literals',
  args: {
    shapes: enumStrings,
  },
  render,
}

/**
 * Values can also be provided as resources.
 * They must be IRIs, present in the Shapes Graph, and `rdfs:label` property will be used as the option text.
 */
export const Resources: Story = {
  name: 'sh:in choice of IRIs',
  args: {
    shapes: enumIris,
  },
  render,
}
