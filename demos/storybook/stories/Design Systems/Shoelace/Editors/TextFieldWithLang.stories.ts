import type { Meta } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import textFieldWithLang from '../../../../shapes/editors/dash/TextFieldWithLang/basic.ttl?raw'
import limitedLangsShape from '../../../../shapes/editors/dash/TextFieldWithLang/limited-langs.ttl?raw'

const meta: Meta = {
  ...defaultMeta,
}

export default meta

export const empty = createStory({
  name: 'Empty',
  shapes: textFieldWithLang,
})(configure)

export const prefilled = createStory({
  name: 'Bound to existing data',
  shapes: textFieldWithLang,
  data: '<http://example.com/> <http://schema.org/value> "Hello world"@en .',
  focusNode: 'http://example.com/',
})(configure)

export const limitedLangs = createStory({
  name: 'With sh:languageIn',
  shapes: limitedLangsShape,
})(configure)

export const limitedLangsPrefilled = createStory({
  name: 'Bound to existing data (with sh:languageIn)',
  shapes: limitedLangsShape,
  data: '<http://example.com/> <http://schema.org/value> "Hello world"@en .',
  focusNode: 'http://example.com/',
})(configure)
