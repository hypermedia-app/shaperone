import type { NamedNode } from '@rdfjs/types'

export function getEditorTagName(editor: NamedNode) {
  // last segment
  const tagName = editor.value
    .split('/').pop()!
    .replace(/Editor$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace('#', '-')
    .toLowerCase()
  if (tagName.startsWith('dash')) {
    return tagName
  }

  return `editor-${tagName}`
}
