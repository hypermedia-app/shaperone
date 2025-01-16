import { getEditorTagName } from './editor.js'
import type { ShaperoneForm } from '../ShaperoneForm.js'

export function register(form: ShaperoneForm) {
  const { components, renderer } = form
  const scopedElements: Record<string, CustomElementConstructor> = {}

  for (const ctor of Object.values(components.components)) {
    scopedElements[getEditorTagName(ctor.editor)] = addScopedElements(ctor, scopedElements)
  }

  for (const [name, ctor] of Object.entries(renderer.layoutElements)) {
    scopedElements[`sh1-${name}`] = addScopedElements(ctor, scopedElements)
  }

  form.registry?.define('sh1-focus-node', scopedElements['sh1-focus-node'])
}

function addScopedElements(base: CustomElementConstructor, scopedElements: Record<string, CustomElementConstructor>) {
  return class extends base {
    static get scopedElements() {
      return scopedElements
    }
  }
}
