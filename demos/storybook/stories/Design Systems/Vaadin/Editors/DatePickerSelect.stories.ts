import type { Meta } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import datePicker from '../../../../shapes/editors/dash/DatePicker/minimal.ttl?raw'

const meta: Meta = {
  ...defaultMeta,
}

export default meta

export const empty = createStory({
  name: 'Empty value',
  shapes: datePicker,
  prefixes: ['xsd', 'schema'],
})(configure)
