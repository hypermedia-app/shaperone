import { Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance } from '@hydrofoil/shaperone-core/models/components'
import { html } from 'lit'
import isGraphPointer from 'is-graph-pointer'
import type { GraphPointer } from 'clownface'
import { BooleanSelectEditor } from '@hydrofoil/shaperone-core/lib/components/booleanSelect.js'

export { autocomplete } from './components/autocomplete.js'
export { enumSelect } from './components/enumSelect.js'
export { instancesSelect } from './components/instancesSelect.js'

interface EditorState extends ComponentInstance {
  noLabel?: boolean
}

export const textField: Lazy<SingleEditorComponent<EditorState>> = {
  editor: dash.TextFieldEditor,
  async lazyRender() {
    const { inputRenderer } = await import('./renderer/input.js')

    return inputRenderer()
  },
}

interface TextFieldWithLang extends ComponentInstance {
  language?: string
}

export const textFieldWithLang: Lazy<SingleEditorComponent<TextFieldWithLang>> = {
  editor: dash.TextFieldWithLangEditor,
  async lazyRender() {
    const [{ inputRenderer }] = await Promise.all([
      import('./renderer/input.js'),
      import('./elements/sh-sl-with-lang-editor.js'),
    ])

    function extractLanguage(ptr: GraphPointer | undefined) {
      return isGraphPointer.isLiteral(ptr) ? ptr.term.language : ''
    }

    return function (object, actions) {
      function valueChanged(value: string) {
        actions.update(object.env.literal(value, object.componentState.language))
      }

      function languageChanged(e: any) {
        let language: string | undefined
        if (e.detail.value) {
          language = e.detail.value
        }

        if (isGraphPointer.isGraphPointer(object.value.object)) {
          actions.update(object.env.literal(object.value.object.value, language))
        } else {
          object.updateComponentState({ language })
        }
      }

      return html`
        <sh-sl-with-lang-editor .languages="${object.property.shape.languageIn}"
                                .language="${extractLanguage(object.value.object)}"
                                .readonly="${object.property.shape.readOnly || false}"
                                @language-selected="${languageChanged}">
          ${inputRenderer({ onChange: valueChanged })(object, actions)}
        </sh-sl-with-lang-editor>`
    }
  },
}

export const uri: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  async lazyRender() {
    const { inputRenderer } = await import('./renderer/input.js')

    return inputRenderer({ type: 'url' })
  },
}

export const details: Lazy<SingleEditorComponent> = {
  editor: dash.DetailsEditor,
  async lazyRender() {
    const { render } = await import('./renderer/details.js')
    return render
  },
}

export const boolean: Lazy<BooleanSelectEditor> = {
  editor: dash.BooleanSelectEditor,
  async lazyRender() {
    const { render } = await import('./renderer/boolean.js')
    return render
  },
}
