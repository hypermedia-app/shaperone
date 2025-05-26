import type { Meta } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import textField from '../../../../shapes/editors/dash/TextField/basic.ttl?raw'

const meta: Meta = {
  ...defaultMeta,
}

export default meta

export const empty = createStory({
  name: 'Empty',
  shapes: textField,
})(configure)

export const prefilled = createStory({
  name: 'Bound to existing data',
  shapes: textField,
  data: '<http://example.com/> <http://schema.org/value> "Hello world" .',
  focusNode: 'http://example.com/',
})(configure)
