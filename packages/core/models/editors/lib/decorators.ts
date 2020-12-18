import type { EditorsState, Editor } from '../index'

export function combine<T extends Editor>(decorators: EditorsState['decorators'], editor: T): T {
  return (decorators[editor.term.value] || []).reduce((editor, { decorate }) => ({
    ...editor,
    match: decorate(editor),
  }), editor)
}
