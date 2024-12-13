# shaperone-form

A custom element which renders a form element using graph description in [SHACL format](http://datashapes.org/forms.html).
The underlying value is a graph represented using the [RDF/JS data model specification](https://rdf.js.org/data-model-spec/)

## Usage

This example shows the element used with the default lit renderer

```typescript
import '@hypermedia-app/shaperone-form/shaperone-form.js'
import Environment from '@zazuko/env/Environment.js'
import { configure } from '@hydrofoil/shaperone-wc/configure.js'
import { html } from '@hypermedia-app/shaperone-form'
import alcaeus from 'alcaeus/Factory.js'
import parent from '@zazuko/env/web.js'

const env = new Environment([alcaeus()], { parent })
configure(env)

const shapes = await env.hydra.loadResource('http://example.com/api/shape')
const resource = rdf.clownface().blankNode()

const formTemplate = html`<shaperone-form .shapes=${shapes} .resource=${resource}></shaperone-form>`
```

The above snippet assumes that shapes get loaded from a remote resource and the form value is initialized with a
blank node without any properties.

Such setup will render a very basic and unstyled form using native browser input elements and no specific layout.
Check the main documentation page for instructions on customizing the form's rendering.

**Mixins:** connect

## Properties

| Property            | Attribute            | Modifiers | Type                                             | Default           | Description                                      |
|---------------------|----------------------|-----------|--------------------------------------------------|-------------------|--------------------------------------------------|
| `components`        | `components`         | readonly  |                                                  |                   | Gets the state of the editor components          |
| `configuration`     | `configuration`      |           | `ConfigCallback \| undefined`                    |                   |                                                  |
| `debug`             | `debug`              |           | `boolean`                                        | false             |                                                  |
| `dispatch`          |                      |           |                                                  |                   |                                                  |
| `editors`           | `editors`            | readonly  |                                                  |                   | Gets the state of the DASH editors model         |
| `env`               |                      | readonly  | `Environment<any>`                               |                   | Gets the RDF/JS environment                      |
| `isValid`           |                      | readonly  | `boolean`                                        |                   | Gets a value indicating if there are any `sh:Violation` violation results |
| `noEditorSwitches`  | `no-editor-switches` |           | `boolean`                                        | false             | Disables the ability to change object editors. Only the one with [highest score](http://datashapes.org/forms.html#score) will be rendered |
| `renderer`          |                      |           | `Renderer<UncompiledTemplateResult<ResultType>>` | "DefaultRenderer" | Gets or sets the renderer implementation         |
| `rendererOptions`   | `rendererOptions`    | readonly  |                                                  |                   | Gets the state of the renderer                   |
| `resource`          | `resource`           |           | `GraphPointer<BlankNode \| NamedNode<string>, DatasetCore<Quad, Quad>> \| undefined` |                   | Gets or sets the resource graph as graph pointer |
| `shapes`            | `shapes`             |           | `DatasetCore<Quad, Quad> \| AnyPointer<AnyContext, DatasetCore<Quad, Quad>> \| undefined` |                   | Gets or sets the shapes graph                    |
| `state`             | `state`              |           | `FormState`                                      |                   | Gets the internal state of the form element      |
| `validationReport`  |                      | readonly  | `GraphPointer<Term, DatasetCore<Quad, Quad>> \| undefined` |                   | Gets a graph pointer to the latest [SHACL Validation Report](https://www.w3.org/TR/shacl/#validation-report) |
| `validationResults` |                      | readonly  | `ValidationResultState[]`                        |                   | Get all validation results found in the {@see validationReport} graph |
| `value`             |                      | readonly  | `RdfResource<DatasetCore<Quad, Quad>> \| null`   |                   | Gets the resource as a [rdfine](https://npm.im/@tpluscode/rdfine) object |

## Methods

| Method      | Type                                          | Description                                      |
|-------------|-----------------------------------------------|--------------------------------------------------|
| `configure` | `(fn: ConfigCallback \| undefined): void`     |                                                  |
| `mapEvents` | `(): { changed: ({ detail }: any) => void; }` |                                                  |
| `validate`  | `(): void`                                    | Triggers validation of the current resource against the shapes graph |

## Events

| Event     | Type               |
|-----------|--------------------|
| `changed` | `CustomEvent<any>` |
