import type { Meta } from '@storybook/web-components'
import * as vadin from '@hydrofoil/shaperone-wc-vaadin/components.js'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import { defaultMeta, TextEditors } from '../common.js'

const configure: ConfigCallback = ({ components }) => {
  components.pushComponents(vadin)
}

/**
 * Shaperone provides binding to use [Vaadin components](https://vaadin.com/docs/latest/components) as form elements.
 *
 * ## Installation
 *
 * ```bash
 * npm install @hydrofoil/shaperone-wc-vaadin
 * ```
 *
 * ## Setup
 *
 * ```typescript
 * import * as vaadin from '@hydrofoil/shaperone-wc-vaadin/components.js'
 * import { configure } from '@hydrofoil/shaperone-wc'
 *
 * await configure(({ components }) => {
 *  components.pushComponents(vaadin)
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
