# Editor metadata

The metadata is an RDF graph holding descriptions of [DASH editors](editors/dash.md). Out of the box it comes populated with DASH vocabulary itself which includes English labels for the default editor types.

## Adding metadata

Given a custom editor or willing to add translations of the DASH editors labels, one would have to add triples to the metadata graph.

The simple way is to pass array of RDF/JS [quads](http://rdf.js.org/data-model-spec/#quad-interface) or a [`DatasetCore`](https://rdf.js.org/dataset-spec/#datasetcore-interface) to the configuration object.

```typescript
import { configure } from '@hydrofoil/shaperone-wc/configure'
import { quad } from '@rdf-esm/data-model'

// actually exported from the editor's module
function * metadata() {
  yield quad(editor, rdf.type, dash.SingleEditor)
  yield quad(editor, rdfs.label, literal('Star rating'))
}

configure().editors.addMetadata([...metadata()])
```

A terser alternative is to use [clownface](https://npm.im/clownface) library to ease the buildup of the triples. For example to add custom translations for editors

```typescript
import clownface from 'clownface'
import { dataset, literal } from '@rdf-esm/dataset'
import { dash } from '@tpluscode/rdf-ns-builders'

const translations = clownface({ dataset: dataset() })
  .node(dash.TextFieldEditor)
    .addOut(rdfs.label, [
        literal('Textfeld', 'de'),
        literal('champ de texte', 'fr'),
        literal('Pole tekstowe', 'pl'),
    ])
  .node(dash.TextAreaEditor)
    .addOut(rdfs.label, [
        literal('Mehrzeiliges Textfeld', 'de'),
        literal('Champ de texte multiligne', 'fr'),
        literal('Pole tekstowe wielowierszowe', 'pl'),
    ])

editors.addMetadata(translations.dataset)
```
