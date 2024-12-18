import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import groups from '../../../../shapes/groups.ttl?raw'

const meta = {
  ...defaultMeta,
}

export default meta

/**
 * [Property Groups](https://www.w3.org/TR/shacl/#group) are rendered as tabs
 */
export const empty = createStory({
  name: 'Tabs',
  shapes: groups,
})(configure)
