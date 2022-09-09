# @hydrofoil/shaperone-wc-shoelace

## 0.1.13

### Patch Changes

- 55271d1: Babel build inadvertently caused TS typings to disappear from packages
- Updated dependencies [55271d1]
  - @hydrofoil/shaperone-core@0.9.8
  - @hydrofoil/shaperone-wc@0.7.5

## 0.1.12

### Patch Changes

- b224b43: Typo in package `exports`
- Updated dependencies [683ae4b]
  - @hydrofoil/shaperone-core@0.9.7

## 0.1.11

### Patch Changes

- 68d98aa: Missing imports in `sh-sl-autocomplete`
- Updated dependencies [cb60db7]
  - @hydrofoil/shaperone-core@0.9.6

## 0.1.10

### Patch Changes

- e144fc2: Enum select would not display its values
- 374792b: Dependencies not imported by multi-instances editor

## 0.1.9

### Patch Changes

- 572a38f: Ensure .js extensions are added to all imports. Previously, there were issues with strict ESM imports
- Updated dependencies [572a38f]
  - @hydrofoil/shaperone-core@0.9.5
  - @hydrofoil/shaperone-wc@0.7.4

## 0.1.8

### Patch Changes

- 76f55b0: Added `dash:AutocompleteEditor` and `sh1:InstanceMultiSelectEditor`
- Updated dependencies [76f55b0]
- Updated dependencies [604a1c0]
  - @hydrofoil/shaperone-core@0.9.4
  - @hydrofoil/shaperone-wc@0.7.3

## 0.1.7

### Patch Changes

- 60dbf08: Do no show "add value" button when multi editor is rendered
- f6aa63a: Configurable icons to add/remove objects
- f6aa63a: The default icon to remove an object should be an [X]

## 0.1.6

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
  - @hydrofoil/shaperone-wc@0.7.2

## 0.1.5

### Patch Changes

- e2db802: Render multi editor when selected

## 0.1.4

### Patch Changes

- e7455cb: Prevent `sl-hide` event from hiding parent `sl-details` elements

## 0.1.3

### Patch Changes

- 7d6c3b4: Updated `@rdfjs-elements/lit-helpers` to 0.3.2
- Updated dependencies [7d6c3b4]
- Updated dependencies [7d6c3b4]
  - @hydrofoil/shaperone-wc@0.7.0

## 0.1.2

### Patch Changes

- 33691fa: Update shoelace version to beta.77

## 0.1.1

### Patch Changes

- a8083e3: dash:DetailsEditor: Displayed header should focus node label and shape label as fallback

## 0.1.0

### Minor Changes

- fb09594: First version

  Editors:

  - `dash:DetailsEditor`
  - `dash:TextFieldEditor`
  - `dash:TextFieldWithLangEditor`
  - `dash:URIEditor`

  Templates:

  - nice and simple for property and object
  - tabbed focus node groups

### Patch Changes

- Updated dependencies [9be4ed0]
  - @hydrofoil/shaperone-wc@0.6.11
