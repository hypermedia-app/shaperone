import type { Meta, StoryObj as Story } from '@storybook/web-components'
import enumStrings from '../../../shapes/editors/dash/EnumSelect/strings.ttl?raw'
import enumIris from '../../../shapes/editors/dash/EnumSelect/iris.ttl?raw'
import { createStory, defaultMeta } from '../../common.js'

/**
 * The enum selector is typically rendered as a dropdown menu with a set of choices
 * which a SHACL [`PropertyShape`](https://www.w3.org/TR/shacl/#property-shapes) declares
 * by using the [`sh:in` constraint](https://www.w3.org/TR/shacl/#InConstraintComponent)
 *
 * The default behaviour is to present literal values directly and enumeration of resources
 * (named nodes or blank nodes) will use any `rdfs:label` value found in the **shapes graph**
 */
const meta: Meta = {
  ...defaultMeta,
}

export default meta

/**
 * Values can be provided as literals. Their face value will be used as the option text.
 */
export const Literals: Story = createStory({
  name: 'Choice of literals',
  shapes: enumStrings,
})()

/**
 * Values can also be provided as resources.
 * They must be IRIs, present in the Shapes Graph, and `rdfs:label` property will be used as the option text.
 *
 * Missing labels will be rendered as the IRI itself.
 */
export const Resources: Story = createStory({
  name: 'Choice of IRIs',
  shapes: enumIris,
  customPrefixes: {
    lexvo: 'http://lexvo.org/id/iso639-1/',
  },
})()
