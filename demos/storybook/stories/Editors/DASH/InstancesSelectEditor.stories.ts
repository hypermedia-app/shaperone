import type { StoryObj as Story } from '@storybook/web-components'
import { createStory, defaultMeta } from '../../common.js'
import instances from '../../../shapes/editors/dash/InstancesSelect/wikidata.ttl?raw'
import instancesNoLabels from '../../../shapes/editors/dash/InstancesSelect/no-labels.ttl?raw'
import noLabelsData from '../../../shapes/editors/dash/InstancesSelect/no-labels.data.ttl?raw'
import { configure as configureFetch } from './InstancesSelectEditor/fetch.js'

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
})()

export const WikidataNoLabels: Story = createStory({
  name: 'Resources without labels',
  shapes: instancesNoLabels,
  data: noLabelsData,
  focusNode: 'http://example.org/instance',
  prefixes: ['rdfs', 'schema'],
  customPrefixes: {
    wd: 'http://www.wikidata.org/entity/',
    ex: 'http://example.org/',
  },
})(configureFetch)
