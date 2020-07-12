import { MultiEditorComponent, html } from '@hydrofoil/shaperone-wc'
import { quad, namedNode, literal } from '@rdf-esm/data-model'
import { MultiEditor } from '@hydrofoil/shaperone-core'
import { vcard, dash, rdf, rdfs, sh } from '@tpluscode/rdf-ns-builders'

const editor = namedNode('http://example.com/LanguageMultiSelect')

export const component: (theme: 'lumo' | 'material') => MultiEditorComponent = theme => ({
  editor,
  render({ property }, { update }) {
    const languages = [...property.shape._selfGraph.out(sh.in).list()].map(lang => ({
      id: lang.term.value,
      term: lang.term,
      label: lang.out(rdfs.label).value || lang.value,
    }))

    const values = property.objects.map(o => o.object.term)
    const selected = languages.filter(lang => values.find(object => object.equals(lang.term)))

    return html`<multiselect-combo-box item-id-path="id" item-label-path="label"
                    .selectedItems="${selected}"
                    .items="${languages}"
                    @change="${(e: any) => { update(e.target.selectedItems.map((lang: any) => lang.term)) }}"></multiselect-combo-box>`
  },
  loadDependencies() {
    return [
      import(`multiselect-combo-box/theme/${theme}/multiselect-combo-box`),
    ]
  },
})

export const matcher: MultiEditor = {
  term: editor,
  match(shape) {
    return shape.path.equals(vcard.language) ? 50 : 0
  },
}

export function * metadata() {
  yield quad(editor, rdf.type, dash.MultiEditor)
  yield quad(editor, rdfs.label, literal('Language combobox'))
}
