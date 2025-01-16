import { configure } from '@hydrofoil/shaperone-wc'

configure(({ editors }) => {
  editors.addMetadata(($rdf) => {
    const { dash, rdfs } = $rdf.ns

    return $rdf.clownface()
      .node(dash.TextFieldEditor)
      .addOut(rdfs.label, [
        $rdf.literal('Textfeld', 'de'),
        $rdf.literal('champ de texte', 'fr'),
        $rdf.literal('Pole tekstowe', 'pl'),
      ])
      .node(dash.TextAreaEditor)
      .addOut(rdfs.label, [
        $rdf.literal('Mehrzeiliges Textfeld', 'de'),
        $rdf.literal('Champ de texte multiligne', 'fr'),
        $rdf.literal('Pole tekstowe wielowierszowe', 'pl'),
      ])
  })
})
