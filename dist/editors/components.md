# Components

A component is shaperone's realisation of a DASH editor. At the minimum, a component requires a rendering function (optionally async) and can also be customised with a shared and per-instance functionality.

> [!WARNING]
> Some paragraphs below only apply to `@hydrofoil/shaperone-wc` which is a [lit-html](https://npm.im/lit-html) renderer. While the core interface definitions are similar, implementations using another rendering library could differ slightly.

## Minimal component

The easiest component declaration is a plain JS object which has a property for the implemented `editor` URI and a `render` function. In TypeScript, an interface can also be exported to allow creating derived components, either by inheritance, or decoration. See below.

The `render` function takes two parameters:

1. A context of the rendered value, together with its position in the form hierarchy and the component state
2. Action functions to modify the form state. Most importantly, a function to update the property value when user interacts with the component

```typescript
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { literal, namedNode } from '@rdf-esm/data-model'
import './star-rating'

const editor = namedNode('http://example.com/StarRating')

export const component: SingleEditorComponent = {
  editor,
  render({ value }, { update }) {
    const rating = value.object ? Number.parseFloat(value.object.value) : 0

    function setRating(e: CustomEvent) {
      // can be called with a string literal or RDF/JS node  
      update(literal(e.detail.value.toString(), xsd.float))
    }

    // return a lit-html template, usually rendering a custom element
    return html`<ex-star-rating .value="${rating}" 
                                @value-changed="${setRating}"></ex-star-rating>`
  },
}
```

## Lazy-rendering components

In practice, many components will be used in an application, potentially resulting in large bundles, where some components would never actually appear on any form. For that purpose, an element can dynamically load other modules when it's first used.

```typescript
import { html, Lazy, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { literal, namedNode } from '@rdf-esm/data-model'

const editor = namedNode('http://example.com/StarRating')

// wrap your component type in Lazy
export const component: Lazy<SingleEditorComponent> = {
  editor,
  async lazyRender() {
    // load dependencies dynamically
    await import('./star-rating')

    // return the actual render function when async code finishes 
    return function ({ value }, { update }) {
      const rating = value.object ? Number.parseFloat(value.object.value) : 0

      function setRating(e: CustomEvent) {
        update(literal(e.detail.value.toString(), xsd.float))
      }

      return html`<ex-star-rating .value="${rating}"
                                  @value-changed="${setRating}"></ex-star-rating>`
    }
  },
}
```

## Adding component-specific functionality and shared state

A component's interface can be freely extended with properties and methods alike, which created a shared state for all instances across all forms.

```typescript
import { html, SingleEditorComponent } from '@hydrofoil/shaperone-wc'
import { literal, namedNode } from '@rdf-esm/data-model'

const editor = namedNode('http://example.com/StarRating')

// create an interface for the star rating component
export interface StarRatingComponent extends SingleEditorComponent {
  icon?: IconDefinition
}

export const component: StarRatingComponent = {
  editor,
  render({ value }, { update }) {
    /*
      rest of render code as above
    */

    // the shared component state is accessible from the render function
    return html`<ex-star-rating .value="${rating}"
                                .icon="${this.icon}"
                                @value-changed="${setRating}"></ex-star-rating>`
  },
}
```

This way a component can be configured by the consuming code.

```typescript
import { faFan } from '@fortawesome/free-solid-svg-icons'
import { components, editors, renderer } from '@hydrofoil/shaperone-wc/configure'
import { component as starRating } from './StarRating'

// use a different icon for the ratings
starRating.icon = faFan

components.pushComponents({
  starRating, 
})
```

## Component instance runtime state and component lifecycle

Each occurrence of a component in a form has its own state object which can be updated by the component code. Additionally, a component can have an additional `init` method which lets implementors perform tasks before rendering components.

> [!WARNING]
> The initialisation is called multiple time during the form lifecycle. Implementors need to make sure that any async operations such as loading external resources are only performed once and that the initialization does not fall into an infinite loop.

For example, the `icon` customization shown above could be done differently, on a per-instance basis, so that the SHACL Property Shape would be taken into account when selecting the icon to display based on the predicate or additional metadata. 

```typescript
// state object for individual components
export interface StarRating {
  icon?: IconDefinition | null
  loading?: boolean
}

// allow fallback icon defined globally
export interface StarRatingComponent extends SingleEditorComponent<StarRating> {
  defaultIcon?: IconDefinition
}

async function loadIcon({ defaultIcon, shape, updateComponentState }) {
  let icon: IconDefinition | null = defaultIcon || null
  const iconName: IconName | undefined = shape.pointer.out(dash.icon).value as IconName
  if (iconName) {
    try {
      ({ definition: icon } = await import(`@fortawesome/free-solid-svg-icons/${iconName}.js`))
    } catch (e) {
      icon = null
    }
  }
  
  // once loaded, set the icon to component's state
  updateComponentState({
    icon,
    loading: false,
  })
}

export const component: StarRatingComponent = {
  editor,
  init({ value, updateComponentState, property: { shape } }) {
    if (typeof value.componentState.icon !== 'undefined') {
      return true
    }

    if (value.componentState.loading) {
      return false
    }

    // start loading the icon asynchronously
    loadIcon({
      updateComponentState,
      shape,
      defaultIcon: this.defaultIcon,
    })
    
    // set loading state to prevent unnecessary loops
    updateComponentState({
      loading: true,
    })

    return false
  },
}
```

## Decorating existing components

In the case of an existing, third party components, it is possible to augment their functionality by creating decorators. A decorator can target any type of editor, selected by a function.

```typescript

``` 
