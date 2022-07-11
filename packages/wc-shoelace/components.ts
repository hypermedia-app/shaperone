import { Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { dash } from '@tpluscode/rdf-ns-builders'
import type { ComponentInstance } from '@hydrofoil/shaperone-core/models/components'
import { html } from 'lit'
import rdf from '@rdfjs/data-model'
import { isGraphPointer, isLiteral } from 'is-graph-pointer'
import type { GraphPointer } from 'clownface'

interface EditorState extends ComponentInstance {
  noLabel?: boolean
}

export const textField: Lazy<SingleEditorComponent<EditorState>> = {
  editor: dash.TextFieldEditor,
  async lazyRender() {
    const { inputRenderer } = await import('./renderer/input')

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
      import('./renderer/input'),
      import('./components/sh-sl-with-lang-editor'),
    ])

    function extractLanguage(ptr: GraphPointer | undefined) {
      return isLiteral(ptr) ? ptr.term.language : ''
    }

    return function (object, actions) {
      function valueChanged(value: string) {
        actions.update(rdf.literal(value, object.value.componentState.language))
      }

      function languageChanged(e: any) {
        let language: string | undefined
        if (e.detail.value) {
          language = e.detail.value
        }

        if (isGraphPointer(object.value.object)) {
          actions.update(rdf.literal(object.value.object.value, language))
        } else {
          object.updateComponentState({ language })
        }
      }

      return html`
        <sh-sl-with-lang-editor .languages="${object.property.shape.languageIn}"
                                .language="${extractLanguage(object.value.object)}"
                                @language-selected="${languageChanged}">
          ${inputRenderer({ onChange: valueChanged })(object, actions)}
        </sh-sl-with-lang-editor>`
    }
  },
}

export const uri: Lazy<SingleEditorComponent> = {
  editor: dash.URIEditor,
  async lazyRender() {
    const { inputRenderer } = await import('./renderer/input')

    return inputRenderer({ type: 'url' })
  },
}

export const details: Lazy<SingleEditorComponent> = {
  editor: dash.DetailsEditor,
  async lazyRender() {
    const { render } = await import('./renderer/details')
    return render
  },
}
