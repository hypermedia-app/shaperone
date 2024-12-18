import type { Meta } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import textAreaWithLang from '../../../../shapes/editors/dash/TextAreaWithLang/basic.ttl?raw'
import limitedLangsShape from '../../../../shapes/editors/dash/TextAreaWithLang/limited-langs.ttl?raw'

const meta: Meta = {
  ...defaultMeta,
}

export default meta

export const empty = createStory({
  name: 'Empty',
  shapes: textAreaWithLang,
})(configure)

export const prefilled = createStory({
  name: 'Bound to existing data',
  shapes: textAreaWithLang,
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
