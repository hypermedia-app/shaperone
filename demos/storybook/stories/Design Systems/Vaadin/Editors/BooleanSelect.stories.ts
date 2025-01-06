import type { Meta } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import booleanSelect from '../../../../shapes/editors/dash/BooleanSelect/minimal.ttl?raw'
import defaultFalseShape from '../../../../shapes/editors/dash/BooleanSelect/defaultFalse.ttl?raw'

const meta: Meta = {
  ...defaultMeta,
}

export default meta

/**
 * Without a value, the checkbox is in an indeterminate state
 */
export const empty = createStory({
  name: 'Indeterminate state',
  shapes: booleanSelect,
})(configure)

/**
 * Make sure to set `sh:defaultValue false` to render an initially unchecked box
 */
export const defaultFalse = createStory({
  name: 'Undefined state',
  shapes: defaultFalseShape,
})(configure)

export const prefilled = createStory({
  name: 'Bound (true)',
  shapes: booleanSelect,
  data: '<http://example.com/> <http://schema.org/value> true .',
  focusNode: 'http://example.com/',
})(configure)
