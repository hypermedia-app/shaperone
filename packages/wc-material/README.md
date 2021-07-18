# mwc-editor-toggle

**Mixins:** SelectableMenuMixin

## Properties

| Property        | Attribute       | Type                             | Default |
|-----------------|-----------------|----------------------------------|---------|
| `editors`       | `editors`       | `SingleEditorMatch[]`            | []      |
| `removeEnabled` | `removeEnabled` | `boolean`                        | false   |
| `selected`      | `selected`      | `NamedNode<string> \| undefined` |         |

## Methods

| Method       | Type                                             |
|--------------|--------------------------------------------------|
| `createItem` | `({ text, icon, selected, ...rest }: { text: string; selected: boolean; icon: string; } & Record<string, unknown>): TemplateResult<1>` |

## Events

| Event             | Type                                          |
|-------------------|-----------------------------------------------|
| `editor-selected` | `CustomEvent<{ editor: NamedNode<string>; }>` |
| `object-removed`  |                                               |


# mwc-item-lite

## Properties

| Property      | Attribute    | Type                           | Default |
|---------------|--------------|--------------------------------|---------|
| `noOptions`   | `no-options` | `boolean`                      | true    |
| `optionsSlot` |              | `HTMLSlotElement \| undefined` |         |


# mwc-property-menu

## Properties

| Property   | Attribute  | Type            |
|------------|------------|-----------------|
| `property` | `property` | `PropertyState` |


# mwc-shape-selector

**Mixins:** SelectableMenuMixin

## Properties

| Property   | Attribute  | Type                                             |
|------------|------------|--------------------------------------------------|
| `selected` | `selected` | `NodeShape<DatasetCore<Quad, Quad>> \| undefined` |
| `shapes`   | `shapes`   | `NodeShape<DatasetCore<Quad, Quad>>[] \| undefined` |

## Methods

| Method       | Type                                             |
|--------------|--------------------------------------------------|
| `createItem` | `({ text, icon, selected, ...rest }: { text: string; selected: boolean; icon: string; } & Record<string, unknown>): TemplateResult<1>` |

## Events

| Event            | Type                                             |
|------------------|--------------------------------------------------|
| `shape-selected` | `CustomEvent<{ value: NodeShape<DatasetCore<Quad, Quad>>; }>` |


# wc-menu

## Properties

| Property     | Type           |
|--------------|----------------|
| `menu`       | `Menu`         |
| `menuButton` | `WcMenuButton` |
