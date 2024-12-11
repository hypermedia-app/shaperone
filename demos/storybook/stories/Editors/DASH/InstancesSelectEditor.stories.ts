import type { StoryObj as Story } from '@storybook/web-components'
import { defaultMeta } from '../../common.js'
import { render } from '../../render.js'
import instances from '../../../shapes/editors/dash/InstancesSelect/wikidata.ttl?raw'

const meta = {
  ...defaultMeta,
}

export default meta

/**
 * Just as with enum select, `rdfs:label` is used for option text
 */
export const Wikidata: Story = {
  name: 'Resources by sh:class',
  args: {
    shapes: instances,
    customPrefixes: {
      wd: 'http://www.wikidata.org/entity/',
    },
  },
  render,
}
