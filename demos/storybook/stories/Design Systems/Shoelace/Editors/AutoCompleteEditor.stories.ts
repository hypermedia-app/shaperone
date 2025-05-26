import type { StoryObj as Story } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import local from '../../../../shapes/editors/dash/AutoComplete/local.ttl?raw'
import clearable from '../../../../shapes/editors/dash/AutoComplete/clearable.ttl?raw'
import { configure } from '../configure.js'

const meta = {
  ...defaultMeta,
}

export default meta

/**
 * Similar to the InstancesSelect, but with a search input
 */
export const LocalResources: Story = createStory({
  name: 'Searchable resources',
  shapes: local,
  prefixes: ['rdfs'],
  customPrefixes: {
    wd: 'http://www.wikidata.org/entity/',
  },
})(configure)

export const ValuePreselected: Story = createStory({
  name: 'Value preselected',
  shapes: local,
  data: '<http://example.com/john> <http://schema.org/alumniOf> <http://www.wikidata.org/entity/Q184478> .',
  focusNode: 'http://example.com/john',
  prefixes: ['rdfs'],
  customPrefixes: {
    ex: 'http://example.com/',
    wd: 'http://www.wikidata.org/entity/',
  },
})(configure)

/**
 * When `sh1:clearable` is set to `true`, the editor show a clear button to unset the property
 */
export const Clearable: Story = createStory({
  name: 'Clearable',
  shapes: clearable,
  data: '<http://example.com/john> <http://schema.org/alumniOf> <http://www.wikidata.org/entity/Q184478> .',
  focusNode: 'http://example.com/john',
  prefixes: ['rdfs'],
  customPrefixes: {
    ex: 'http://example.com/',
    wd: 'http://www.wikidata.org/entity/',
  },
})(configure)
