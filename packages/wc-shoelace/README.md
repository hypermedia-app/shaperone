# sh-sl-autocomplete

## Properties

| Property     | Attribute    | Type                                             | Default |
|--------------|--------------|--------------------------------------------------|---------|
| `empty`      | `empty`      | `boolean`                                        | true    |
| `hoist`      | `hoist`      | `boolean`                                        | true    |
| `inputValue` | `inputValue` | `string`                                         | ""      |
| `readonly`   | `readonly`   | `boolean`                                        | false   |
| `selected`   | `selected`   | `GraphPointer<Term, DatasetCore<Quad, Quad>> \| undefined` |         |

## Methods

| Method                 | Type                          |
|------------------------|-------------------------------|
| `dispatchItemSelected` | `(e: CustomEvent<any>): void` |
| `dispatchSearch`       | `(): void`                    |
| `updateEmpty`          | `(e: Event): void`            |

## Events

| Event          | Type                              |
|----------------|-----------------------------------|
| `itemSelected` | `CustomEvent<{ value: any; }>`    |
| `search`       | `CustomEvent<{ value: string; }>` |


# sh-sl-object

## Properties

| Property       | Attribute      | Type                   |
|----------------|----------------|------------------------|
| `canBeRemoved` | `canBeRemoved` | `boolean \| undefined` |
| `removeIcon`   | `removeIcon`   | `string \| undefined`  |

## Events

| Event     |
|-----------|
| `removed` |


# sh-sl-property

## Properties

| Property      | Attribute     | Type                   |
|---------------|---------------|------------------------|
| `addIcon`     | `addIcon`     | `string \| undefined`  |
| `canAddValue` | `canAddValue` | `boolean \| undefined` |
| `helpText`    | `helpText`    | `string \| undefined`  |
| `label`       | `label`       | `string \| undefined`  |

## Events

| Event   |
|---------|
| `added` |


# sh-sl-with-lang-editor

## Properties

| Property    | Attribute   | Type                    | Default |
|-------------|-------------|-------------------------|---------|
| `language`  | `language`  | `string \| undefined`   |         |
| `languages` | `languages` | `string[] \| undefined` |         |
| `readonly`  | `readonly`  | `boolean`               | false   |

## Events

| Event               | Type                           |
|---------------------|--------------------------------|
| `language-selected` | `CustomEvent<{ value: any; }>` |
