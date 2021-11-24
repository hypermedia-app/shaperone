# Getting Started

To add a most basic form to you app create a `<shaperone-form>` element in your HTML and set its `shapes` property with a [RDF/JS Dataset](https://rdf.js.org/dataset-spec/#datasetcore-interface) or [clownface](https://zazuko.github.io/clownface) graph pointer.

```js
// 1. Import the Web Component's package
import '@hydrofoil/shaperone-wc/shaperone-form.js'

// 2. Load or create shape's RDF representation
const shape = fetchShape()

// 3. Set the shape to the element
document.querySelector('shaperone-form').shapes = shape
```

To access the contents of a form get the `.resource` property which again returns a [clownface](https://zazuko.github.io/clownface) graph pointer object.

> [!TIP]
> Naturally, the `.resource` property also has a getter. If not set, the form will be initialized with an empty string `<>` named node.

Below you'll find a running example rendering a very simple form. It also adds a simple button which will open the resulting RDF in a new tab, serialized as turtle.

<iframe
  src="https://webcomponents.dev/edit/O8SwE2klRV1wMB87Rkh2/src/shapes/person.ttl?pm=1&sv=1&embed=1"
  title="shaperone-form"
  style="border:0; border-radius: 4px; overflow:hidden;height: 500px"
  sandbox="allow-scripts allow-same-origin allow-popups">
</iframe>
