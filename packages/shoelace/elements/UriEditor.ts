import { dash } from '@tpluscode/rdf-ns-builders'
import TextField from './TextFieldEditor.js'

export default class extends TextField {
  static editor = dash.URIEditor

  get type(): TextField['type'] {
    return 'url'
  }
}
