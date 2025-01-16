import type { StoryObj as Story } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import local from '../../../../shapes/editors/dash/AutoComplete/local.ttl?raw'
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
