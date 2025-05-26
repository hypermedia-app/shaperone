# sh1-property

**Mixins:** ScopedElementsMixin

## Properties

| Property    | Attribute   | Type                                 |
|-------------|-------------|--------------------------------------|
| `focusNode` | `focusNode` | `FocusNodeState`                     |
| `property`  | `property`  | `PropertyState`                      |
| `registry`  |             | `CustomElementRegistry \| undefined` |

## Methods

| Method                | Type                                             |
|-----------------------|--------------------------------------------------|
| `addEventListener`    | `<K extends keyof HTMLElementEventMap>(type: K, listener: (this: CustomEventTarget, ev: HTMLElementEventMap[K]): void, options?: boolean \| ... 1 more ... \| undefined) => void` |
| `dispatchEvent`       | `<K extends keyof HTMLElementEventMap>(ev: CustomEvent<HTMLElementEventMap[K]>): boolean` |
| `removeEventListener` | `<K extends keyof HTMLElementEventMap>(type: K, listener: (this: CustomEventTarget, ev: HTMLElementEventMap[K]): void, options?: boolean \| ... 1 more ... \| undefined) => void` |
| `renderAddButton`     | `(): TemplateResult<1> \| ""`                    |
| `renderObject`        | `(object: PropertyObjectState<Term>): TemplateResult<1>` |
| `renderObjects`       | `(): TemplateResult<1>`                          |
