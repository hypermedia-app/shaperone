import { createStory, defaultMeta } from '../../../common.js'
import { configure } from './configure.js'
import groups from '../../../../shapes/groups.ttl?raw'

const meta = {
  ...defaultMeta,
}

export default meta

/**
 * [Property Groups](https://www.w3.org/TR/shacl/#group) are rendered as an accordion element
 */
export const example = createStory({
  name: 'Accordion',
  shapes: groups,
})(configure)
