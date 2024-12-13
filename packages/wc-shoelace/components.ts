import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js'

export { TextField } from './editors/TextField.js'

/*
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
*/
