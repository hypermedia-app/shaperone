# @hydrofoil/shaperone-wc-shoelace

## 0.2.3

### Patch Changes

- 6c85b6c: Relax shoelace dependency
- 42e9cf1: Add "clearable" option to `dash:AutoCompleteEditor`, `dash:InstancesSelectEditor` and `dash:EnumSelectEditor`.

  To enable, annotate Property Shape with `sh1:clearable`

## 0.2.2

### Patch Changes

- e80cbbe: DetailsViewer: when object state has override of `sh:node`, it should be used instead of the property's `sh:node`
- Updated dependencies [01611d5]
  - @hydrofoil/shaperone-core@0.10.1

## 0.2.1

### Patch Changes

- 781b66b: By mistake, every details would open expanded and not only newly added. Reverting

## 0.2.0

### Minor Changes

- dff822d: A `dash:DetailsEditor` will expand by default when added to form as new object

### Patch Changes

- Updated dependencies [dff822d]
  - @hydrofoil/shaperone-core@0.10.0
  - @hydrofoil/shaperone-wc@0.7.11

## 0.1.26

### Patch Changes

- bc4128b: When an autocomplete was populated on load, it would unnecessarily call `loadInstance` upon selection
- Updated dependencies [ef3aa6c]
  - @hydrofoil/shaperone-core@0.9.15
  - @hydrofoil/shaperone-wc@0.7.10

## 0.1.25

### Patch Changes

- 8a8e0b5: Autocomplete would open again immediately after selecting a value
- c0592ee: Autocomplete would open when not focused

## 0.1.24

### Patch Changes

- c337f03: Allow empty string return from add-object template
- Updated dependencies [c7b4315]
  - @hydrofoil/shaperone-core@0.9.14

## 0.1.23

### Patch Changes

- 86d4287: Extends property renderer to support overriding the controls to add new object
- Updated dependencies [d1be750]
- Updated dependencies [680f6dc]
  - @hydrofoil/shaperone-core@0.9.13
  - @hydrofoil/shaperone-wc@0.7.9

## 0.1.22

### Patch Changes

- fab77ac: Autcomplete would cause outer `sl-details` to open automatically
- Updated dependencies [c974b6b]
  - @hydrofoil/shaperone-core@0.9.12

## 0.1.21

### Patch Changes

- d9ea23b: Do not show blank node id as default dropwdown label
- 6628a4b: Improve autocomplete usability by handling spacebar properly and automatically opening the menu when done loading
- f51c1ef: Spin the icon when loading initial autosomplete selection
- Updated dependencies [79cece9]
- Updated dependencies [79cece9]
- Updated dependencies [358db18]
  - @hydrofoil/shaperone-wc@0.7.8
  - @hydrofoil/shaperone-core@0.9.11

## 0.1.20

### Patch Changes

- e0c8909: To not trigger search immediately when typing in auto complete editor
- e0c8909: When loading, chage the icon to spinning arrows

## 0.1.19

### Patch Changes

- e90097a: Disable editors when `dash:readOnly`
- fbcf734: Implement `dash:BooleanSelectEditor` as checkbox

## 0.1.18

### Patch Changes

- 30dafb4: In some scenarios, multi-select would fall into endless udpate loop and freeze the browser

## 0.1.17

### Patch Changes

- 18b5ab1: In some scenarios, multi-select would fall into endless udpate loop and freeze the browser

## 0.1.16

### Patch Changes

- 3100c0a: Clearing a multiselect would not remove triples from graph

## 0.1.15

### Patch Changes

- 7f8d013: Typo in `exports` was fixed wrong

## 0.1.14

### Patch Changes

- 50d4582: One more build fix, where babel tried to compile `.d.ts` files
- Updated dependencies [50d4582]
  - @hydrofoil/shaperone-core@0.9.9
  - @hydrofoil/shaperone-wc@0.7.6

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
