import { dash } from '@tpluscode/rdf-ns-builders'
import { FieldWithLangMixin } from './FieldWithLangEditor.js'
import TextArea from './TextAreaEditor.js'

export default class extends FieldWithLangMixin(TextArea) {
  static editor = dash.TextAreaWithLangEditor

  static extends = dash.TextAreaEditor
}
