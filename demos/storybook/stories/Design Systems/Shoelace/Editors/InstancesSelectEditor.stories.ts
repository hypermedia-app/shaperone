import type { StoryObj as Story } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../../common.js'
import instances from '../../../../shapes/editors/dash/InstancesSelect/wikidata.ttl?raw'
import { configure } from '../configure.js'

const meta = {
  ...defaultMeta,
}

export default meta

export const Wikidata: Story = createStory({
  name: 'Resources by sh:class',
  shapes: instances,
  prefixes: ['rdfs'],
  customPrefixes: {
    wd: 'http://www.wikidata.org/entity/',
  },
})(configure)
