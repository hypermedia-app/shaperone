# Configuration

Most of the configuration is done on a shared configuration object which applies to all form instances within an application. That is provide a consistent behavior across said application. 

In addition to that, individual form elements can be fine-tuned by using HTML's standard API of properties and attributes.

To initialise the configuration, first call the `configure` function from the `@hydrofoil/shaperone-wc/configure` module. This function takes an RDF environment as parameter and returns an object with properties descibed in the following sections.

```typescript
import rdf from '@zazuko/env'
import { configure } from '@hydrofoil/shaperone-wc/configure.js'

const config = configure(rdf)
```

On subsequent calls, the argument can be skipped.

## Editors

Everything about [editors](editors.md) is set up as shown below where the configuration is customized by providing the pieces necessary to support a hypothetical "star rating editor".

```typescript
import { configure } from '@hydrofoil/shaperone-wc/configure'
import { matcher, metadata } from './star-rating'

configure().editors.addMatchers(matcher)
configure().editors.addMetadata(metadata)
```

> [!TIP]
> The `addMatchers` method also takes an object as parameter so that entire set of matchers can easily be added from a start import
> 
> ```typescript
> import { configure } from '@hydrofoil/shaperone-wc/configure.js'
> import * as myMatchers from './matchers'
>
> configure().editors.addMatchers(myMatchers)
> ```

## Components

The editor components are registered using another export of the same module:

```typescript
import { configure } from '@hydrofoil/shaperone-wc/configure.js'
import starRating from './star-rating-component'

configure().components.pushComponents({ starRating })
```

Components can also be removed by referring to their URI identifier:

```typescript
import { configure } from '@hydrofoil/shaperone-wc/configure.js'
import { namedNode } from '@rdf-esm/data-model'

configure().components.removeComponents([
    namedNode('http://example.com/StarRatingEditor')
])
```

## Renderer

Consumers willing to change or extend the way the forms render can do so by replacing or adding render functions to the `render strategy`.

For example, to wrap focus node markup in an additional HTML, the strategy can be wrapped to decorate the default function.

```typescript
import { html } from '@hydrofoil/shaperone-wc'
import { configure } from '@hydrofoil/shaperone-wc/configure.js'
import { DefaultStrategy } from '@hydrofoil/shaperone-wc/renderer/DefaultStrategy'
import type { FocusNodeRenderStrategy } from '@hydrofoil/shaperone-wc/lib/renderer'

// the actual rendering is done by lit-html
const collapsibleFocusNode: FocusNodeRenderStrategy = (params) => {
    return html`<collapsible-panel>
        ${DefaultStrategy.focusNode(params)}
    </collapsible-panel>`
}

// a render strategy can also dynamically load its dependencies when they are first needed
collapsibleFocusNode.loadDependencies = () => {
    return [
        import('./collapsible-panel')
    ]
}

// finally, the extensions has to be added, combined with all other rendering methods
configure().renderer.setStrategy({
    ...DefaultStrategy,
    focusNode: collapsibleFocusNode,
})
```

## Editor element instance

Lastly, some configuration can be done on a per-instance fashion. For example, to disable the ability to change editors an attribute is set to the form element.

```html
<shaperone-form no-editor-switches></shaperone-form>
```

The form Web Component's API is available on a generated page: [https://forms.hypermedia.app/shaperone-form](https://forms.hypermedia.app/shaperone-form) 

> [!WARNING]
> It is important to realise that this has to be explicitly supported by the render strategy. The default strategy seen imported above supports both multiple editor choices for form fields as well as disabling this feature. Another renderer might be implemented differently.
