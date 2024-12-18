import type { StoryObj as Story } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import enumStrings from '../../../../shapes/editors/dash/EnumSelect/strings.ttl?raw'
import enumIris from '../../../../shapes/editors/dash/EnumSelect/iris.ttl?raw'
import { configure } from '../configure.js'

const meta = {
  ...defaultMeta,
}

export default meta
export const Literals: Story = createStory({
  name: 'Choice of literals',
  shapes: enumStrings,
})(configure)

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
})(configure)
