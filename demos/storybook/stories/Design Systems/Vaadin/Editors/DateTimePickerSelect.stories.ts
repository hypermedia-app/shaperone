import type { Meta } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import dateTimePicker from '../../../../shapes/editors/dash/DateTimePicker/minimal.ttl?raw'

const meta: Meta = {
  ...defaultMeta,
}

export default meta

export const empty = createStory({
  name: 'Empty value',
  shapes: dateTimePicker,
  prefixes: ['xsd', 'schema'],
})(configure)
