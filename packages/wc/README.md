# shaperone-form

A custom element which renders a form element using graph description in [SHACL format](http://datashapes.org/forms.html).
The underlying value is a graph represented using the [RDF/JS data model specification](https://rdf.js.org/data-model-spec/)

## Usage

This example shows the element used with the default lit-html renderer

```typescript
import '@hypermedia-app/shaperone-form/shaperone-form.js'
import { html } from '@hypermedia-app/shaperone-form'
import { Hydra } from 'alcaeus/web'
import { dataset, blankNode } from '@rdf-esm/dataset'

const shapes = await Hydra.loadResource('http://example.com/api/shape')
const resource = clownface({
   dataset: dataset(),
   term: blankNode(),
})

const formTemplate = html`<shaperone-form .shapes=${shapes} .resource=${resource}></shaperone-form>`
```

**Mixins:** connect

## Properties

| Property           | Attribute            | Modifiers | Type                                             | Default | Description                                      |
|--------------------|----------------------|-----------|--------------------------------------------------|---------|--------------------------------------------------|
| `components`       | `components`         | readonly  | `Record<string, ComponentState<TemplateResult>>` |         | Gets the state of the editor components          |
| `editors`          | `editors`            | readonly  | `EditorsState`                                   |         | Gets the state of the DASH editors model         |
| `noEditorSwitches` | `no-editor-switches` |           | `boolean`                                        | false   | Disables the ability to change object editors. Only the one with [highest score](http://datashapes.org/forms.html#score) will be rendered |
| `renderer`         |                      |           | `Renderer`                                       | {}      | Gets or sets the renderer implementation         |
| `rendererOptions`  | `rendererOptions`    | readonly  | `RendererState`                                  |         | Gets the state of the renderer                   |
| `resource`         |                      |           | `GraphPointer<BlankNode \| NamedNode<string>, DatasetCore<Quad, Quad>> \| undefined` |         | Gets or sets the resource graph as graph pointer |
| `resourceDataset`  |                      | readonly  | `DatasetCore<Quad, Quad> \| undefined`           |         | Gets the resource as graph as [RDF/JS DatasetCore](https://rdf.js.org/dataset-spec/#datasetcorefactory-interface) |
| `shapes`           |                      |           | `DatasetCore<Quad, Quad> \| AnyPointer<AnyContext, DatasetCore<Quad, Quad>> \| undefined` |         | Gets or sets the shapes graph                    |
| `state`            | `state`              |           | `FormState`                                      |         | Gets the internal state of the form element      |
| `value`            |                      | readonly  | `RdfResource<DatasetCore<Quad, Quad>> \| null`   |         | Gets the resource as a [rdfine](https://npm.im/@tpluscode/rdfine) object |

## Methods

| Method      | Type                             |
|-------------|----------------------------------|
| `mapEvents` | `((): DispatchMap) \| undefined` |
