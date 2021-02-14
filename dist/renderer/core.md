# Renderer

While the core library does not provide any rendering code, it defines a set of base interfaces for renderers. At the highest level a renderer is a simple interface, with but a single method to render the entire form.

```typescript
/**
 * @module @hydrofoil/shaperone-core/renderer
 */

export interface RenderContext {
  form: symbol
  editors: EditorsState
  state: FormState
  components: ComponentsState
  dispatch: Dispatch
  shapes: NodeShape[]
}


export interface Renderer<TRenderResult> {
  render(params: RenderContext): TRenderResult
}
```

However, the assumption is that the implementation breaks up the rendering in at least the following parts:

1. [The form](/api/interfaces/_hydrofoil_shaperone_core_renderer.formrenderer.html) itself at the top level
2. [Focus Node](/api/interfaces/_hydrofoil_shaperone_core_renderer.focusnoderenderer.html)
3. (Optionally) [Group Shapes](/api/interfaces/_hydrofoil_shaperone_core_renderer.grouprenderer.html)
4. [Property Shapes](/api/interfaces/_hydrofoil_shaperone_core_renderer.propertyrenderer.html)
5. [Objects](/api/interfaces/_hydrofoil_shaperone_core_renderer.objectrenderer.html)

Each subsequent renderer level expands the one above by adding the context objects and mutation callbacks, called `actions`. For example, a `PropertyRenderer` combines its parents and adds the property state object and functions.

Although it is up to the implementors to follow this pattern exactly or not, ultimately the components' render method require an instance of `ObjectRenderer`, which represents the object's position in the graph.
