import { dash } from '@tpluscode/rdf-ns-builders'
import { FieldWithLangMixin } from './FieldWithLangEditor.js'
import TextField from './TextFieldEditor.js'

export default class extends FieldWithLangMixin(TextField) {
  static editor = dash.TextFieldWithLangEditor

  static extends = dash.TextFieldEditor
}
