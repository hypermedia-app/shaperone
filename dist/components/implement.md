# Implementing components

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

In the case of an existing, third party components, it is possible to augment their functionality by creating decorators. A decorator can target any type of component, selected by a function. To implement a component decorator, create a plain object with a `decorate` function which takes the original component and returns its augmented version. Because a completely new object can be returned, a decorator gives full control about any aspect of the components.  

In this example all components will be wrapped in additional `<div>` to display the property shape's `sh:description` on mouse hover. 

```typescript
import { TemplateResult } from 'lit-element'
import { html } from '@hydrofoil/shaperone-wc'
import { ComponentDecorator } from '@hydrofoil/shaperone-core/models/components'
import type { PropertyShape } from '@rdfine/shacl'

function wrap(shape: PropertyShape, result: TemplateResult) {
  if (shape.description) {
    return html`<div title="${shape.description}">${result}</div>`
  }

  return result
}

export const DescriptionTooltip: ComponentDecorator = {
  applicableTo() {
    return true
  },
  decorate(component) {
    if ('lazyRender' in component) {
      return {
        ...component,
        lazyRender: async () => {
          const render = await component.lazyRender()
          return function (params, actions) {
            return wrap(params.property.shape, render.call(this, params, actions))
          }
        },
      }
    }

    return {
      ...component,
      render(params, actions) {
        return wrap(params.property.shape, component.render(params, actions))
      },
    }
  },
}
```

The `ComponentDecorator` type is generic, allowing typed decorators of specific components, such as `ComponentDecorator<StarRatingComponent>`. Remember though, that it is up to the `applicableTo` method to choose the correct components to process. The type annotation is only a dev-time hint. 

> [!TIP]
> Pay attention to the conditional logic to wrap a lazy component differently

## Working example

> [!EXAMPLE]
> Click the screenshot to see the star rating component in action.

[![example multi editor](../_media/star-rating.png)][example-star-rating]

[example-star-rating]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22foaf%22%3A+%22http%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2FJohn_Doe%22%2C%0A++%22%40type%22%3A+%22schema%3ARating%22%2C%0A++%22http%3A%2F%2Fexample.com%2Faccuracy%22%3A+%7B%0A++++%22%40type%22%3A+%22xsd%3Afloat%22%2C%0A++++%22%40value%22%3A+%223.5%22%0A++%7D%2C%0A++%22http%3A%2F%2Fexample.com%2FdeliveryTime%22%3A+%7B%0A++++%22%40type%22%3A+%22xsd%3Afloat%22%2C%0A++++%22%40value%22%3A+%223%22%0A++%7D%2C%0A++%22http%3A%2F%2Fexample.com%2Fsatisfaction%22%3A+%7B%0A++++%22%40type%22%3A+%22xsd%3Afloat%22%2C%0A++++%22%40value%22%3A+%224%22%0A++%7D%0A%7D&selectedResource=http%3A%2F%2Fexample.com%2FJohn_Doe&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E+.%0A%40prefix+dash%3A+%3Chttp%3A%2F%2Fdatashapes.org%2Fdash%23%3E+.%0A%40prefix+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E+.%0A%40prefix+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%40prefix+lexvo%3A+%3Chttp%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2F%3E+.%0A%0Aex%3APersonShape%0A++a+sh%3AShape+%3B%0A++sh%3AtargetClass+schema%3ARating+%3B%0A++rdfs%3Alabel+%22Rate+you+purchase%22+%3B%0A++sh%3Aproperty+ex%3ADeliveryTime+%2C%0A++++++++++++++ex%3AItemAccuracy+%2C%0A++++++++++++++ex%3ASatisfaction+%3B%0A.%0A%0Aex%3ASatisfaction%0A++a+sh%3APropertyShape+%3B%0A++sh%3Apath+ex%3Asatisfaction+%3B%0A++sh%3Aname+%22Overall+satisfaction%22+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3Adatatype+xsd%3Afloat+%3B%0A++dash%3Aeditor+ex%3AStarRating+%3B%0A++dash%3Aicon+%22faSmile%22+%3B%0A++sh%3Aorder+30+%3B%0A.%0A%0Aex%3AItemAccuracy%0A++a+sh%3APropertyShape+%3B%0A++sh%3Apath+ex%3Aaccuracy+%3B%0A++sh%3Aname+%22Item+accuracy%22+%3B%0A++sh%3Adescription+%22How+closely+does+the+item+match+the+advertised+description%3F%22+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3Adatatype+xsd%3Afloat+%3B%0A++dash%3Aeditor+ex%3AStarRating+%3B%0A++dash%3Aicon+%22faThumbsUp%22+%3B%0A++sh%3Aorder+10+%3B%0A.%0A%0A%0Aex%3ADeliveryTime%0A++a+sh%3APropertyShape+%3B%0A++sh%3Apath+ex%3AdeliveryTime+%3B%0A++sh%3Aname+%22Delivery+time%22+%3B%0A++sh%3Adescription+%22Has+the+seller+dispatched+the+item+in+a+timely+manner%3F+Did+it+arrive+on+time%3F%22+%3B%0A++sh%3AminCount+1+%3B%0A++sh%3AmaxCount+1+%3B%0A++sh%3Adatatype+xsd%3Afloat+%3B%0A++dash%3Aeditor+ex%3AStarRating+%3B%0A++dash%3Aicon+%22faBoxOpen%22+%3B%0A++sh%3Aorder+20+%3B%0A.%0A

[example-multi-editor]: ${playground}/?resource=%7B%0A++%22%40context%22%3A+%7B%0A++++%22rdf%22%3A+%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%2C%0A++++%22rdfs%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%22%2C%0A++++%22xsd%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%22%2C%0A++++%22schema%22%3A+%22http%3A%2F%2Fschema.org%2F%22%2C%0A++++%22vcard%22%3A+%22http%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%22%0A++%7D%2C%0A++%22%40id%22%3A+%22http%3A%2F%2Fexample.com%2FJohn_Doe%22%2C%0A++%22%40type%22%3A+%22schema%3APerson%22%2C%0A++%22vcard%3Alanguage%22%3A+%5B%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2Fde%22%0A++++%7D%2C%0A++++%7B%0A++++++%22%40id%22%3A+%22http%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2Fpl%22%0A++++%7D%0A++%5D%0A%7D&shapes=%40prefix+sh%3A+%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Fshacl%23%3E+.%0A%40prefix+schema%3A+%3Chttp%3A%2F%2Fschema.org%2F%3E+.%0A%40prefix+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E+.%0A%40prefix+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E+.%0A%40prefix+vcard%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2006%2Fvcard%2Fns%23%3E+.%0A%0A%40prefix+ex%3A+%3Chttp%3A%2F%2Fexample.com%2F%3E+.%0A%40prefix+lexvo%3A+%3Chttp%3A%2F%2Flexvo.org%2Fid%2Fiso639-1%2F%3E+.%0A%0Aex%3APersonShape%0A++a+sh%3AShape+%3B%0A++sh%3AtargetClass+schema%3APerson+%3B%0A++rdfs%3Alabel+%22Person%22+%3B%0A++sh%3Aproperty+ex%3ASpokenLanguagesProperty+%3B%0A.%0A%0Aex%3ASpokenLanguagesProperty%0A++sh%3Apath+vcard%3Alanguage+%3B%0A++sh%3Aname+%22Spoken+languages%22+%3B%0A++sh%3AnodeKind+sh%3AIRI+%3B%0A++sh%3Ain+%28%0A++++lexvo%3Aen+lexvo%3Ade+lexvo%3Afr+lexvo%3Apl+lexvo%3Aes%0A++%29+%3B%0A.%0A%0Alexvo%3Aen+rdfs%3Alabel+%22English%22+.%0Alexvo%3Ade+rdfs%3Alabel+%22German%22+.%0Alexvo%3Afr+rdfs%3Alabel+%22French%22+.%0Alexvo%3Apl+rdfs%3Alabel+%22Polish%22+.%0Alexvo%3Aes+rdfs%3Alabel+%22Spanish%22+.&components=vaadin
