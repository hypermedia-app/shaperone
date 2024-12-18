import type { Meta } from '@storybook/web-components'
import { turtle } from '@tpluscode/rdf-string'
import { ex } from '@shaperone/testing'
import { rdfs, schema } from '@tpluscode/rdf-ns-builders'
import { createStory, defaultMeta } from '../../../common.js'
import { configure } from '../configure.js'
import shNodeShape from '../../../../shapes/editors/dash/Details/sh-node.ttl?raw'
import labelShape from '../../../../shapes/editors/dash/Details/node-label.ttl?raw'

/**
 * Renders a child resource wrapped in a collapsible `<sl-details>` element.
 */
const meta: Meta = {
  ...defaultMeta,
}

export default meta

/**
 * `sh:node` shape will be used, if given. By default,
 * will use the shape's label as the summary of the collapsible panel.
 */
export const shNode = createStory({
  name: 'Shape selected with sh:node',
  shapes: labelShape,
  focusNode: ex.resource,
  data: turtle`${ex.resource} a ${schema.Thing} ; ${schema.value} [ ${schema.name} "John Doe" ] .`,
})(configure)

/**
 * If the resource itself has a label, it will be used as the summary of the collapsible panel.
 */
export const instanceLabel = createStory({
  name: 'Instance label',
  shapes: shNodeShape,
  focusNode: ex.resource,
  prefixes: ['schema', 'rdfs'],
  data: turtle`${ex.resource} a ${schema.Thing} ; ${schema.value} [ ${rdfs.label} "John Doe" ] .`,
})(configure)
