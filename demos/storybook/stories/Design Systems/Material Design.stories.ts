import type { Meta } from '@storybook/web-components'
import * as materialComponents from '@hydrofoil/shaperone-wc-material/components.js'
import * as materialRenderer from '@hydrofoil/shaperone-wc-material/renderer/index.js'
import * as materialTabs from '@hydrofoil/shaperone-wc-material/renderer/tabs.js'
import type { ConfigCallback } from '@hydrofoil/shaperone-wc/configure.js'
import { Grouping, TextEditors } from '../common.js'

const configure: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(materialComponents)
  renderer.setTemplates({
    object: materialRenderer.object,
    property: materialRenderer.property,
  })
}

/**
 * Shaperone provides binding to use [Material Web Components](https://shoelace.style/) as form elements and form layout.
 *
 * ⚠️ Note that this package uses an old beta version of Material Web Components. ⚠️
 *
 * ## Installation
 *
 * ```bash
 * npm install @hydrofoil/shaperone-wc-material
 * ```
 *
 * ## Setup
 *
 * ```typescript
 * import * as materialComponents from '@hydrofoil/shaperone-wc-material/components.js'
 * import { configure } from '@hydrofoil/shaperone-wc'
 *
 * await configure(({ components, renderer }) => {
 *  components.pushComponents(materialComponents)
 * })
 * ```
 */
const meta: Meta = {
  component: 'shaperone-form',
  argTypes: {
    focusNode: {
      control: 'text',
    },
    shape: {
      control: 'text',
    },
    prefixes: {
      control: 'text',
    },
  },
  args: {
    prefixes: 'schema',
  },
}

export default meta

/**
 * Showcases text editors
 */
export const textEditors = TextEditors(configure)

const configureTabs: ConfigCallback = ({ components, renderer }) => {
  components.pushComponents(materialComponents)
  renderer.setTemplates({
    object: materialRenderer.object,
    property: materialRenderer.property,
  })
  renderer.setTemplates(materialTabs)
}

/**
 * [Property Groups](https://www.w3.org/TR/shacl/#group) are rendered as tabs. To enable this feature,
 * import from the `@hydrofoil/shaperone-wc-material/renderer/tabs.js` module and combine with the other templaes
 * in the configuration function.
 *
 * ```typescript
 * import * as materialTabs from '@hydrofoil/shaperone-wc-material/renderer/tabs.js'
 * import * as materialRenderer from '@hydrofoil/shaperone-wc-material/renderer/index.js'
 * import { configure } from '@hydrofoil/shaperone-wc'
 *
 * await configure(({ renderer }) => {
 *  renderer.setTemplates({
 *     object: materialRenderer.object,
 *     property: materialRenderer.property,
 *   })
 *   renderer.setTemplates(materialTabs)
 * })
 * ```
 */
export const grouping = Grouping(configureTabs, {
  name: 'Groups as tabs',
})
