# @hydrofoil/shaperone-wc

## 0.7.9

### Patch Changes

- d1be750: When adding a new object for a property, it should is now possible to override the `nodeKind` to
  select
- 680f6dc: When adding a new object for a property, it should is now possible to override the `editor` to select
- Updated dependencies [d1be750]
- Updated dependencies [680f6dc]
  - @hydrofoil/shaperone-core@0.9.13

## 0.7.8

### Patch Changes

- 79cece9: Enum Select would not show values for literal nodes
- Updated dependencies [79cece9]
- Updated dependencies [358db18]
  - @hydrofoil/shaperone-core@0.9.11

## 0.7.7

### Patch Changes

- 80e08c9: Focus node action to clear a selected property

## 0.7.6

### Patch Changes

- 50d4582: One more build fix, where babel tried to compile `.d.ts` files
- Updated dependencies [50d4582]
  - @hydrofoil/shaperone-core@0.9.9

## 0.7.5

### Patch Changes

- 55271d1: Babel build inadvertently caused TS typings to disappear from packages
- Updated dependencies [55271d1]
  - @hydrofoil/shaperone-core@0.9.8

## 0.7.4

### Patch Changes

- 572a38f: Ensure .js extensions are added to all imports. Previously, there were issues with strict ESM imports
- Updated dependencies [572a38f]
  - @hydrofoil/shaperone-core@0.9.5

## 0.7.3

### Patch Changes

- 604a1c0: Export default metadata for multi instances select editor
- Updated dependencies [76f55b0]
- Updated dependencies [604a1c0]
  - @hydrofoil/shaperone-core@0.9.4

## 0.7.2

### Patch Changes

- 7eaafd8: Change how `componentState` is accessed in calls to `render`, `init`, etc., which unifies implementations of single
  editors and multi editors.

  Implementors who wish to reuse their code with both kinds of editors, should update their functions so that
  `componentState` is retrieved from the first argument and not from `value` (which does not exist in the case of
  multi editors).

  ```diff
  {
  - init({ value: { componentState } }) {
  - init({ value, componentState }) {
  }
  - render({ value: { componentState } }) {
  + render({ value, componentState }) {
   }
  }
  ```

- Updated dependencies [7eaafd8]
  - @hydrofoil/shaperone-core@0.9.3

## 0.7.1

### Patch Changes

- 5099ddc: Fix: `init` would not have been called for multi-editors when calling `renderMultiEditor`
- Updated dependencies [5099ddc]
  - @hydrofoil/shaperone-core@0.9.2

## 0.7.0

### Minor Changes

- 7d6c3b4: Significant changes in handling translations:

  - `Item` interface is removed. All translations should be directly retrieved from `GraphPointer`
    objects wherever needed
  - `languages` property removed from `FormSetting`. Instead, the current display language(s) are
    sourced from `@rdfjs-elements/lit-helpers`. `navigator.languages` by default
  - `label` function removed from interface of `dash:EnumSelectEditor` and
    `dash:InstancesSelectEditor` since they will be dynamically rendered using the
    `@rdfjs-elements/lit-helpers/localizedLabel.js` directive

### Patch Changes

- 7d6c3b4: Updated `@rdfjs-elements/lit-helpers` to 0.3.2
- Updated dependencies [7d6c3b4]
  - @hydrofoil/shaperone-core@0.9.0

## 0.6.11

### Patch Changes

- 9be4ed0: Missing `custom-elements.json` in package

## 0.6.10

### Patch Changes

- 61ac785: Update `@tpluscode/rdf-ns-builders` to v2
- Updated dependencies [61ac785]
- Updated dependencies [bc6a5d6]
- Updated dependencies [bc6a5d6]
  - @hydrofoil/shaperone-core@0.8.8

## 0.6.9

### Patch Changes

- 09c9057: Support multi-lingual shape labels
- Updated dependencies [09c9057]
  - @hydrofoil/shaperone-core@0.8.7

## 0.6.8

### Patch Changes

- 4f5fbd7: Add `actions` argument to component's `init()` method. This allows easier handling of async tasks which require to modify the component's underlying model
- Updated dependencies [4f5fbd7]
  - @hydrofoil/shaperone-core@0.8.6

## 0.6.7

### Patch Changes

- 130b191: The ability to update focus node values using graphs and not just individual terms
- Updated dependencies [130b191]
- Updated dependencies [130b191]
  - @hydrofoil/shaperone-core@0.8.3

## 0.6.6

### Patch Changes

- 8551639: Uncaught exception when selecting empty option in native `InstancesSelector`

## 0.6.5

### Patch Changes

- e05b7f8: Re-export `render` from lit

## 0.6.4

### Patch Changes

- 45c440c: Update lit to a non-RC version

## 0.6.3

### Patch Changes

- c39d829: Add slot[name=buttons] after the main form

## 0.6.2

### Patch Changes

- 00c7661: Set a empty string named node and default resource for `shaperone-form`

## 0.6.1

### Patch Changes

- 63e36f4: Make fields readonly/disabled when `dash:readOnly` is set
- Updated dependencies [a5581fd]
  - @hydrofoil/shaperone-core@0.8.1

## 0.6.0

### Minor Changes

- 0f1e31c: Update to `lit@2`

### Patch Changes

- ca8803c: Improve displaying errors on native inputs
- Updated dependencies [0ce3e61]
  - @hydrofoil/shaperone-core@0.8.0

## 0.5.2

### Patch Changes

- 096d202: Update rdfine packages
- Updated dependencies [096d202]
  - @hydrofoil/shaperone-core@0.7.4

## 0.5.1

### Patch Changes

- e20edd5: Update RDF/JS types, rdfine and @tpluscode/rdf-ns-builders
- Updated dependencies [e20edd5]
  - @hydrofoil/shaperone-core@0.7.3

## 0.5.0

### Minor Changes

- e18978c: Validation: display errors inline as supported by components

### Patch Changes

- 3da25a3: Utility to create template decorators (#125)
- e2a3f31: Do not render `dash:hidden` properties
- Updated dependencies [2b80867]
- Updated dependencies [7d86a50]
- Updated dependencies [0a4164b]
- Updated dependencies [e18978c]
- Updated dependencies [e2a3f31]
- Updated dependencies [e9b2b01]
  - @hydrofoil/shaperone-core@0.7.0

## 0.4.6

### Patch Changes

- @hydrofoil/shaperone-core@0.6.9

## 0.4.5

### Patch Changes

- 975accf: Wrong focus node state instead of pointer passed to component render
- 07e7ac2: Also allow object state passed to remove from property renderer
- Updated dependencies [07e7ac2]
  - @hydrofoil/shaperone-core@0.6.8

## 0.4.4

### Patch Changes

- Updated dependencies [0c57318]
  - @hydrofoil/shaperone-core@0.6.7

## 0.4.3

### Patch Changes

- 5cf78cd: Add property renderer action to remove arbitrary object
- 7ecccb0: Component state was not passed to multi editor

## 0.4.2

### Patch Changes

- da63f75: Mark packages ES module
- 90f84d7: Ensure that rendered focus nodes are recreated when dataset changes
- Updated dependencies [da63f75]
  - @hydrofoil/shaperone-core@0.6.6

## 0.4.1

### Patch Changes

- 1a02b63: Allow selecting shape when rendering focus node
- a66d4d6: Pass correct focusNode object to component init
- Updated dependencies [1a02b63]
  - @hydrofoil/shaperone-core@0.6.5

## 0.4.0

### Minor Changes

- 6172891: Complete rewrite of the WC renderer

### Patch Changes

- afd820c: Use templates to render editor/component partials
- Updated dependencies [6172891]
  - @hydrofoil/shaperone-core@0.6.4

## 0.3.5

### Patch Changes

- Updated dependencies [dceb137]
  - @hydrofoil/shaperone-core@0.6.3

## 0.3.4

### Patch Changes

- Updated dependencies [18ffe89]
- Updated dependencies [12e03f7]
- Updated dependencies [bada256]
  - @hydrofoil/shaperone-core@0.6.2

## 0.3.3

### Patch Changes

- Updated dependencies [1a4c2b3]
  - @hydrofoil/shaperone-core@0.6.1

## 0.3.2

### Patch Changes

- Updated dependencies [b851c1a]
- Updated dependencies [0b2feac]
- Updated dependencies [7b79795]
  - @hydrofoil/shaperone-core@0.6.0

## 0.3.1

### Patch Changes

- Updated dependencies [82ee36b]
- Updated dependencies [a783307]
- Updated dependencies [82ee36b]
  - @hydrofoil/shaperone-core@0.5.1

## 0.3.0

### Minor Changes

- f9f99a2: Clean up properties of `shaperone-form` element
- 65967a5: Clean up core component interfaces
- dadeff8: Do not register form element in main module

### Patch Changes

- 9d99c0c: Added dash:BooleanSelectEditor
- Updated dependencies [903ff67]
- Updated dependencies [5ee02a8]
- Updated dependencies [10b4345]
- Updated dependencies [8d401fa]
- Updated dependencies [65967a5]
- Updated dependencies [b3d5ca9]
  - @hydrofoil/shaperone-core@0.5.0

## 0.2.6

### Patch Changes

- fcd46be: Package as es modules and not commonjs
- Updated dependencies [cdf8707]
- Updated dependencies [fcd46be]
- Updated dependencies [9c4e7e3]
  - @hydrofoil/shaperone-core@0.4.4

## 0.2.5

### Patch Changes

- Updated dependencies [b91d81a]
  - @hydrofoil/shaperone-core@0.4.3

## 0.2.4

### Patch Changes

- 8fae858: Default languages set from navigator
- Updated dependencies [8fae858]
- Updated dependencies [ac3df4e]
- Updated dependencies [f37b75d]
- Updated dependencies [a126971]
- Updated dependencies [6700fa9]
- Updated dependencies [b47bd64]
  - @hydrofoil/shaperone-core@0.4.2

## 0.2.3

### Patch Changes

- Updated dependencies [e831915]
  - @hydrofoil/shaperone-core@0.4.1

## 0.2.2

### Patch Changes

- 93965e6: Update rdfine
- 2b854ea: Extract common functionality of enum and instance select editors in a simple composition
- Updated dependencies [93965e6]
- Updated dependencies [2b854ea]
- Updated dependencies [18c76d0]
- Updated dependencies [62d8742]
  - @hydrofoil/shaperone-core@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies [84d7b1e]
  - @hydrofoil/shaperone-core@0.3.1

## 0.2.0

### Minor Changes

- 1772fd7: Change how lazy components are implemented

## 0.1.6

### Patch Changes

- 43039b8: Added dash:DateTimePickerEditor
- Updated dependencies [627dd89]
- Updated dependencies [c41966b]
- Updated dependencies [58d647c]
- Updated dependencies [d8343b6]
  - @hydrofoil/shaperone-core@0.3.0

## 0.1.5

### Patch Changes

- 9702fdd: Added instant change notification event
- c16e00b: Handle multiple empty object fields
- Updated dependencies [1fdb3ca]
- Updated dependencies [9702fdd]
- Updated dependencies [c16e00b]
- Updated dependencies [3e34259]
- Updated dependencies [6a5b20e]
- Updated dependencies [7aad50c]
- Updated dependencies [aa9a943]
  - @hydrofoil/shaperone-core@0.2.4

## 0.1.4

### Patch Changes

- Updated dependencies [7c88a8b]
  - @hydrofoil/shaperone-core@0.2.3

## 0.1.3

### Patch Changes

- 15203fc: Added default components for dash:InstancesSelectEditor
- d86891f: Added support for dash:URIEditor
- 544acb4: Do not throw when meta is missing
- Updated dependencies [15203fc]
- Updated dependencies [d86891f]
- Updated dependencies [9073e8c]
  - @hydrofoil/shaperone-core@0.2.2

## 0.1.2

### Patch Changes

- ba567ae: Have global window.Shaperon.DEBUG flag control redux devtools integration

## 0.1.1

### Patch Changes

- 8752a56: Add option to disable changing editors for all objects
- 76e0849: Allow setting a graph pointer for shapes
- Updated dependencies [8752a56]
- Updated dependencies [06aa5eb]
- Updated dependencies [76e0849]
- Updated dependencies [1fef3d1]
  - @hydrofoil/shaperone-core@0.2.1

## 0.1.0

### Minor Changes

- e7348c4: Update @captaincodeman/rdx

### Patch Changes

- Updated dependencies [e7348c4]
  - @hydrofoil/shaperone-core@0.2.0

## 0.0.3

### Patch Changes

- 5bbbc23: Fix packages but bundling build JS files
- Updated dependencies [5bbbc23]
  - @hydrofoil/shaperone-core@0.1.1

## 0.0.2

### Patch Changes

- 2f14bb3: Update rdfine to 0.5 and clownface to 1.0
- Updated dependencies [b86f901]
- Updated dependencies [8659712]
- Updated dependencies [8659712]
- Updated dependencies [e517a63]
- Updated dependencies [7787606]
- Updated dependencies [2f14bb3]
- Updated dependencies [b86f901]
  - @hydrofoil/shaperone-core@0.1.0

## 0.0.1

### Patch Changes

- Initial version
- Updated dependencies [undefined]
  - @hydrofoil/shaperone-core@0.0.1
