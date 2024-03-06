import { MultiEditorComponent, html } from '@hydrofoil/shaperone-wc'
import $rdf from '@zazuko/env'
import { MultiEditor, Lazy } from '@hydrofoil/shaperone-core'
import { vcard, rdfs } from '@tpluscode/rdf-ns-builders'
import { getLocalizedLabel } from '@rdfjs-elements/lit-helpers'
import { sort } from '@hydrofoil/shaperone-core/lib/components'
import { ShaperoneEnvironment } from '@hydrofoil/shaperone-core/env'

const editor = $rdf.namedNode('http://example.com/LanguageMultiSelect')

export const component: (theme: 'lumo' | 'material') => Lazy<MultiEditorComponent> = theme => ({
  editor,
  async lazyRender() {
    await import(`multiselect-combo-box/theme/${theme}/multiselect-combo-box`)

    return ({ env, property }, { update }) => {
      const languages = property.shape.in
        .map(lang => property.shape.pointer.node(lang))
        .sort(sort(property.shape, env))
        .map(lang => ({
          id: lang.value,
          term: lang.term,
          label: getLocalizedLabel(lang.out(rdfs.label)) || lang.value,
        }))

      const values = property.objects.map(o => o.object)
      const selected = languages.filter(lang => values.find(object => object?.term.equals(lang.term)))

      function setValues(e: any) {
        const newSelection = e.target.selectedItems

        if (newSelection.length > selected.length && !property.canAdd) {
          e.target.selectedItems = selected
          return
        }

        if (newSelection.length < selected.length && !property.canRemove) {
          e.target.selectedItems = selected
          return
        }

        update(newSelection.map((lang: any) => lang.term))
      }

      return html`<multiselect-combo-box item-id-path="id" item-label-path="label"
                      .selectedItems="${selected}"
                      .items="${languages}"
                      .invalid="${property.hasErrors}"
                      .errorMessage="${property.validationResults.map(({ result }) => result.resultMessage).join('; ')}"
                      @change="${setValues}"></multiselect-combo-box>`
    }
  },
})

export const matcher: MultiEditor = {
  term: editor,
  match(shape) {
    return shape.pathEquals(vcard.language) ? 50 : 0
  },
}

export function * metadata(env: ShaperoneEnvironment) {
  yield env.quad(editor, env.ns.rdf.type, env.ns.dash.MultiEditor)
  yield env.quad(editor, env.ns.rdfs.label, env.literal('Language combobox'))
}
