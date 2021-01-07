# @hydrofoil/shaperone-core

While it would not typically be referenced directly, the core library serves a number of purposes which other packages and implementors build upon:

1. State management of all forms, editors, components
3. Implements matchers for DASH editors
4. Exports base implementation of some components

## Base components

### dash:EnumSelectEditor

The core Enum Select Editor is implemented to initialize the choices to display and sort them by their labels.

```typescript
export interface EnumSelect {
  ready?: boolean
  choices?: [GraphPointer, string][]
  loading?: boolean
}

export interface EnumSelectEditor extends SingleEditorComponent<EnumSelect> {
  loadChoices(params: {
    focusNode: FocusNode
    property: PropertyShape
  }): Promise<GraphPointer[]>
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
  sort(left: [GraphPointer, string], right: [GraphPointer, string]): number
}
```

> [!WARNING]
> In a future version the `label` is going to be moved to the renderer.

Implementors wishing to create a custom component only need to provide the actual `render` function.

```typescript
import { enumSelect, EnumSelectEditor } from '@hydrofoil/shaperone-core/components'

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

```typescript
export interface InstancesSelect {
  ready?: boolean
  instances?: [GraphPointer, string][]
  selectedInstance?: [GraphPointer, string]
  loading?: boolean
}

export interface InstancesSelectEditor extends SingleEditorComponent<InstancesSelect, any> {
  loadInstance(params: {
    property: PropertyShape
    value: GraphPointer
  }): Promise<GraphPointer | null>
  loadChoices(params: SingleEditorRenderParams<InstancesSelect>): Promise<GraphPointer[]>
  shouldLoad(params: SingleEditorRenderParams<InstancesSelect>): boolean
  label(choice: GraphPointer, form: Pick<FormSettings, 'labelProperties' | 'languages'>): string
  sort(left: [GraphPointer, string], right: [GraphPointer, string]): number
}
```

The actual implementation will not be much different either. At the minimum, a `render` method is required with possibility of overriding the other functions or adding your own.
