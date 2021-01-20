# @hydrofoil/shaperone-core

While it would not typically be referenced directly, the core library serves a number of purposes which other packages and implementors build upon:

1. State management of all forms, editors, components
3. Implements matchers for DASH editors
4. Exports base implementation of some components

The module [`@hydrofoil/shaperone-core/components`](http://localhost:3000/api/modules/_hydrofoil_shaperone_core_components.html) exports interfaces and, in some cases, minimal implementations of [DASH editors](editors/dash.md) which can be used to build actual components for use with Shaperone.

## Editor selection

In addition to the editor selection by virtue of [matchers](editors/matchers.md), Shaperone supports the [`dash:editor` annotation](http://datashapes.org/forms.html#property-shapes) of Property Shapes which lets Shape publishers instruct the form to prefer an arbitrary editor to be used for that property's objects. 

```turtle
prefix sh: <http://www.w3.org/ns/shacl#>
prefix dash: <http://datashapes.org/dash#>

<> a sh:PropertyShape ;
  dash:editor dash:TextFieldWithLangEditor ;
.
```

Any editor annotated this way will automatically get a score equal `100` without calling the editor's matcher (if any). This leaves applications room for additional customisation, allowing them to override the `dash:editor` by providing a matcher, or matcher decorator, which would return a higher score still. 

## Implementing a DASH component

At the minimum, a `render` function is required to complete a component. For example, here's a simple `dash:BooleanSelectEditor`, rendered as HTML native elements with lit-html:

```typescript
import { booleanSelect, BooleanSelectEditor } from '@hydrofoil/shaperone-core/components'
import { html } from 'lit-html'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'

export const nativeBooleanSelect: BooleanSelectEditor = {
  ...booleanSelect,
  render({ value }, { update }) {
    function changed(e: any) {
      update(literal(e.target.value, xsd.boolean))
    }

    return html`<select @change="${changed}">
      <option></option>
      <option value="true" ?selected="${value.object?.value === 'true'}">true</option>
      <option value="false" ?selected="${value.object?.value === 'false'}">false</option>
    </select>`
  },
}
```

## Extending a DASH component

All DASH components export an interface for their shared and instance state. By using TypeScript's [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) feature it is possible to add functionality.

The snippets below propose an extension to the `nativeBooleanSelect` which adds an optional label to display on the "empty option"

```typescript
import { booleanSelect, BooleanSelectEditor } from '@hydrofoil/shaperone-core/components'
import { html } from 'lit-html'
import { xsd } from '@tpluscode/rdf-ns-builders'
import { literal } from '@rdf-esm/data-model'

// extend the component interface using module augmentation
declare module '@hydrofoil/shaperone-core/components' {
    interface BooleanSelectEditor {
        emptyOptionLabel: string
    }
}

export const nativeBooleanSelect: BooleanSelectEditor = {
  ...booleanSelect,
 emptyOptionLabel: '', // set the default value for the label
  render({ value }, { update }) {
    function changed(e: any) {
      update(literal(e.target.value, xsd.boolean))
    }

    return html`<select @change="${changed}">
      <option>${this.emptyOptionLabel}</option>
      <option value="true" ?selected="${value.object?.value === 'true'}">true</option>
      <option value="false" ?selected="${value.object?.value === 'false'}">false</option>
    </select>`
  },
}
```

> [!TIP]
> Check the [Create your own](components/implement.md) page for more examples of component state interface

## Base component implementations

While most of the DASH components are only stubs, some actually provide a core functionality which gives a uniform basis for building components using specific web components libraries.

> [!TIP]
> See the [Material Design](https://github.com/hypermedia-app/shaperone/tree/master/packages/wc-material) and [Vaadin](https://github.com/hypermedia-app/shaperone/tree/master/packages/wc-vaadin) packages for actual implementations

### dash:EnumSelectEditor

The core Enum Select Editor is implemented to initialize the choices to display and sort them by their labels.

| Component interface | Instance interface |
| -- | -- |
| [EnumSelectEditor](http://localhost:3000/api/interfaces/_hydrofoil_shaperone_core_components.enumselecteditor.html) | [EnumSelect](http://localhost:3000/api/interfaces/_hydrofoil_shaperone_core_components.enumselect.html) |

Implementors wishing to create a custom component only need to provide the actual `render` function.

```typescript
import { enumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'
import { html } from '@hydrofoil/shaperone-wc'

export const enumSelectEditor: EnumSelectEditor = {
  ...enumSelect,
  async render({ value }) {
    const choices = value.componentState.choices || []

    return html`<my-select .choices="${choices}"></my-select>`
  },
}
```

### dash:EnumSelectEditor

Similarly, the Instances Select Editor provides the basic functionality necessary for building a complete component.

| Component interface | Instance interface |
| -- | -- |
| [InstancesSelectEditor](http://localhost:3000/api/interfaces/_hydrofoil_shaperone_core_components.instancesselecteditor.html) | [InstancesSelect](http://localhost:3000/api/interfaces/_hydrofoil_shaperone_core_components.instancesselect.html) |

The actual implementation will not be much different either. At the minimum, a `render` method is required with possibility of overriding the other functions or adding your own.
