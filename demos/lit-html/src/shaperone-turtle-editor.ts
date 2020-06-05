import { customElement, LitElement, css, query } from 'lit-element'
import { html } from 'lit-html'

function whenDefined(getter: () => unknown): Promise<void> {
  const interval = 10
  const maxWaits = 100
  let counter = 0

  return new Promise((resolve, reject) => {
    const awaiter = setInterval(() => {
      const value = getter()
      if (value) {
        clearInterval(awaiter)
        resolve()
      }
      if (++counter === maxWaits) {
        clearInterval(awaiter)
        reject(new Error('Value did not become truthy in time'))
      }
    }, interval)
  })
}

@customElement('shaperone-turtle-editor')
export class ShaperoneTurtleEditor extends LitElement {
  static get styles() {
    return css`.wrapper {
      width:100%;
      height: 100%;
      display: flex;
      position:relative;
    }

    wc-codemirror {
      flex: 1
    }`
  }

  __value = ''

  get value() {
    return this.__value
  }

  set value(value: string) {
    this.__value = value
    if (this.codeMirror?.__editor) {
      this.codeMirror.__editor.setValue(value)
    }
  }

  @query('wc-codemirror')
  codeMirror: any

  render() {
    return html`<div class="wrapper"><wc-codemirror mode="turtle"></wc-codemirror></div>`
  }

  protected async firstUpdated(props: any) {
    super.firstUpdated(props)
    await whenDefined(() => this.codeMirror?.__initialized)

    this.codeMirror.__editor.setSize('100%', '100%')
    this.codeMirror.setValue(this.value)
    this.codeMirror.__editor.on('change', (c: any) => {
      this.__value = c.getValue()
    })
  }
}
