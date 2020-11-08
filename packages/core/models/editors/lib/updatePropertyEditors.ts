import { PropertyState } from '../../forms'
import { matchEditors } from './match'
import type { Dispatch } from '../../../state'
import type { Editor, MultiEditor, SingleEditor } from '../index'
import { FocusNode } from '../../../index'

interface Params{
  dispatch: Dispatch
  singleEditors: Editor<SingleEditor>[]
  multiEditors: Editor<MultiEditor>[]
  focusNode: FocusNode
  form: symbol
}

export function updatePropertyEditors({ dispatch, singleEditors, multiEditors, form, focusNode }: Params) {
  return (property: PropertyState) => {
    const { shape } = property
    const propertyEditors = multiEditors
      .map(editor => ({ editor, score: editor.match(shape) }))
      .filter(match => match.score === null || match.score > 0)
      .map(e => e.editor) || []
    dispatch.forms.setPropertyEditors({
      form,
      focusNode,
      propertyShape: shape,
      editors: propertyEditors,
    })

    property.objects.forEach((object) => {
      dispatch.forms.setSingleEditors({
        form,
        focusNode,
        propertyShape: shape,
        object: object.key,
        editors: matchEditors(shape, object.object, singleEditors),
      })
    })
  }
}
