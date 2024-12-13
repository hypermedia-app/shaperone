import type { Meta } from '@storybook/web-components'
import * as editors from '@hydrofoil/shaperone-wc-shoelace/components.js'
import { button, focusNode, object, property } from '@hydrofoil/shaperone-wc-shoelace/templates.js'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import { defaultMeta, Grouping, TextEditors } from '../common.js'

const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(editors)
  renderer.pushComponents({
    'focus-node': focusNode,
    button,
    object,
    property,
  })
}

/**
 * Shaperone provides binding to use [Shoelace](https://shoelace.style/) as form elements and form layout.
 *
 * ## Installation
 *
 * ```bash
 * npm install @hydrofoil/shaperone-wc-shoelace
 * ```
 *
 * ## Setup
 *
 * ```typescript
 * import * as shoelace from '@hydrofoil/shaperone-wc-shoelace/components.js'
 * import * as templates from '@hydrofoil/shaperone-wc-shoelace/templates.js'
 * import { configure } from '@hydrofoil/shaperone-wc'
 *
 * await configure(({ components, renderer }) => {
 *  components.pushComponents(shoelace)
 *  renderer.setTemplates(templates)
 * })
 * ```
 */
const meta: Meta = {
  ...defaultMeta,
}

export default meta

/**
 * Showcases text editors
 */
export const textEditors = TextEditors(configure)

/**
 * [Property Groups](https://www.w3.org/TR/shacl/#group) are rendered as tabs
 */
export const grouping = Grouping(configure)
