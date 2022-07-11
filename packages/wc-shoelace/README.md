# sh-sl-object

## Properties

| Property       | Attribute      | Type                   |
|----------------|----------------|------------------------|
| `canBeRemoved` | `canBeRemoved` | `boolean \| undefined` |

## Events

| Event     |
|-----------|
| `removed` |


# sh-sl-property

## Properties

| Property      | Attribute     | Type                   |
|---------------|---------------|------------------------|
| `canAddValue` | `canAddValue` | `boolean \| undefined` |
| `helpText`    | `helpText`    | `string \| undefined`  |
| `label`       | `label`       | `string \| undefined`  |

## Events

| Event   |
|---------|
| `added` |


# sh-sl-with-lang-editor

## Properties

| Property    | Attribute   | Type                    |
|-------------|-------------|-------------------------|
| `language`  | `language`  | `string \| undefined`   |
| `languages` | `languages` | `string[] \| undefined` |

## Events

| Event               | Type                           |
|---------------------|--------------------------------|
| `language-selected` | `CustomEvent<{ value: any; }>` |
