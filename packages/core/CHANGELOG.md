# @hydrofoil/shaperone-core

## 0.9.6

### Patch Changes

- cb60db7: When adding a new value to a property which was `sh:nodeKind sh:IRI`, an empty IRI `<>` was always created, even if it clashed without existing nodes. Now random IRI references will be generated.
  Also, if a property is annotated with `sh1:iriPrefix`, it will be used as base for the created URIs

## 0.9.5

### Patch Changes

- 572a38f: Ensure .js extensions are added to all imports. Previously, there were issues with strict ESM imports

## 0.9.4

### Patch Changes

- 76f55b0: Added a module which exports `sh1` namespace for extensions
- 604a1c0: Export default metadata for multi instances select editor

## 0.9.3

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

## 0.9.2

### Patch Changes

- 5099ddc: Potentially breaking: removed `focusOnObjectNode` from multi editor actions since it was not actually passed to
  the implementing code, nor did it make sense anyway.

## 0.9.1

### Patch Changes

- 5b8ed7f: Separate `dash:AutoCompleteEditor` with similar functionality so the `dash:InstancesSelectEditor` so that they can be
  implemented as different components more easily

## 0.9.0

### Minor Changes

- 7d6c3b4: Significant changes in handling translations:

  - `Item` interface is removed. All translations should be directly retrieved from `GraphPointer`
    objects wherever needed
  - `languages` property removed from `FormSetting`. Instead, the current display language(s) are
    sourced from `@rdfjs-elements/lit-helpers`. `navigator.languages` by default
  - `label` function removed from interface of `dash:EnumSelectEditor` and
    `dash:InstancesSelectEditor` since they will be dynamically rendered using the
    `@rdfjs-elements/lit-helpers/localizedLabel.js` directive

## 0.8.8

### Patch Changes

- 61ac785: Update `@tpluscode/rdf-ns-builders` to v2
- bc6a5d6: Default value would have incorrectly used `xsd:langString` instead of `rdf:langString` to fill the form
- bc6a5d6: `TextAreaWithLangEditor` wrongly matched on `rdf:string` instead of `xsd:string`

## 0.8.7

### Patch Changes

- 09c9057: Support multi-lingual shape labels

## 0.8.6

### Patch Changes

- 4f5fbd7: Add `actions` argument to component's `init()` method. This allows easier handling of async tasks which require to modify the component's underlying model

## 0.8.5

### Patch Changes

- e403709: Setting pointer as property value would always add quads to default graph even when focus node was in a named graph

## 0.8.4

### Patch Changes

- a7dc6b9: Setting pointer would still leave unconnected blanks sometimes
- a7dc6b9: Rewrite all blank nodes when setting a pointer to a property

## 0.8.3

### Patch Changes

- 130b191: Ensure that there are no dangling blank nodes left over when removing values from graph
- 130b191: The ability to update focus node values using graphs and not just individual terms

## 0.8.2

### Patch Changes

- 0dbce33: Updated immer (vulnerabilities CVE-2021-23436 and CVE-2021-3757)

## 0.8.1

### Patch Changes

- a5581fd: `dash:readOnly` - disable controls and prevent callbacks from changing data

## 0.8.0

### Minor Changes

- 0ce3e61: Pre-select available editor, even if scored lower (fixes #85)

  Potentially breaking: changed state object for multi editors

## 0.7.4

### Patch Changes

- 096d202: Update rdfine packages

## 0.7.3

### Patch Changes

- e20edd5: Update RDF/JS types, rdfine and @tpluscode/rdf-ns-builders
- Updated dependencies [e20edd5]
  - clownface-shacl-path@1.0.2

## 0.7.2

### Patch Changes

- 4ddb56a: Add parameter to support server-side text search of instances

## 0.7.1

### Patch Changes

- 23a2b1a: Apply `sh:class` to blank node children of given Property Shape

## 0.7.0

### Minor Changes

- 0a4164b: Improved sh:path handling

### Patch Changes

- 2b80867: State actions to show and hide properties
- 7d86a50: Basic support for NodeShape logical constraints
- e18978c: Validation: combine validation report with form state
- e2a3f31: Do not render `dash:hidden` properties
- e9b2b01: Add logical constraints state to focus node state
- Updated dependencies [0a4164b]
  - clownface-shacl-path@1.0.1

## 0.6.9

### Patch Changes

- Updated dependencies [1f178e4]
  - clownface-shacl-path@1.0.0

## 0.6.8

### Patch Changes

- 07e7ac2: Also allow object state passed to remove from property renderer

## 0.6.7

### Patch Changes

- 0c57318: Add property renderer action to remove object

## 0.6.6

### Patch Changes

- da63f75: Mark packages ES module

## 0.6.5

### Patch Changes

- 1a02b63: Allow selecting shape when rendering focus node

## 0.6.4

### Patch Changes

- 6172891: Pass a renderer to components' render function (moved renderer interfaces to core library)

## 0.6.3

### Patch Changes

- dceb137: Decorator: simplify decorating the render function

## 0.6.2

### Patch Changes

- 18ffe89: Adding new field should add a blank node object when there is sh:nodeKind
- 12e03f7: Add component action to remove self
- bada256: Security: Update immer (resolves vulnerability CVE-2020-28477)

## 0.6.1

### Patch Changes

- 1a4c2b3: Still, dash:editor would get lost when updating object state

## 0.6.0

### Minor Changes

- 7b79795: Change the model for editors. Make meta optional

### Patch Changes

- b851c1a: Matcher for dash:BooleanSelectEditor
- 0b2feac: Always prefer dash:editor

## 0.5.1

### Patch Changes

- 82ee36b: Ensure shapes and resource state cleaned on disconnect
- a783307: DASH was unnecessarily parsed multiple times
- 82ee36b: Ensure consistent state when resource is set before connectedCallback

## 0.5.0

### Minor Changes

- 65967a5: Clean up core component interfaces

### Patch Changes

- 903ff67: Added action to clear value without removing field
- 5ee02a8: Export stubs for all DASH components
- 10b4345: Apply dash:editor to added form field
- 8d401fa: Improve component decorator for easier use
- b3d5ca9: Allow quad array to add metadata

## 0.4.4

### Patch Changes

- cdf8707: Update clownface
- fcd46be: Package as es modules and not commonjs
- 9c4e7e3: Ensure default value removed on object update

## 0.4.3

### Patch Changes

- b91d81a: Enum select would not initilize choices

## 0.4.2

### Patch Changes

- 8fae858: Default languages set from navigator
- ac3df4e: Added decorators to component matchers
- f37b75d: Property Shape extensions not available when imported
- a126971: Update editors any time matchers/metadata is added
- 6700fa9: Prevent unnecessary layout recalculations when pointers don't really change
- b47bd64: Decorator feature for components

## 0.4.1

### Patch Changes

- e831915: Keep hidden sh:equals properties in sync

## 0.4.0

### Minor Changes

- 62d8742: dash:DetailsEditor should never get a positive score by default

### Patch Changes

- 93965e6: Update rdfine
- 2b854ea: Extract common functionality of enum and instance select editors in a simple composition
- 18c76d0: Favor langString editor over plain text field

## 0.3.1

### Patch Changes

- 84d7b1e: Components are not getting replaced in the store

## 0.3.0

### Minor Changes

- d8343b6: Change how lazy components are implemented

### Patch Changes

- 627dd89: Correctly set intital canAdd/canRemove flag values
- c41966b: Implement complete shape selection based on targets
- 58d647c: Select root shape from graph pointer

## 0.2.4

### Patch Changes

- 1fdb3ca: Prevent breaking focus stack when resources are new pointers of same data
- 9702fdd: Added instant change notification event
- c16e00b: Handle multiple empty object fields
- 3e34259: Make adding editors and componnets more flexible
- 6a5b20e: Prevent unnecessary changes when setting same shapes graph
- 7aad50c: Ensure default values are populated in resource graph
- aa9a943: Add matchers of `dash:TextFieldWithLangEditor` and `dash:TextAreaWithLangEditor`

## 0.2.3

### Patch Changes

- 7c88a8b: Update @zazuko/rdf-vocabularies

## 0.2.2

### Patch Changes

- 15203fc: Added default components for dash:InstancesSelectEditor
- d86891f: Added support for dash:URIEditor
- 9073e8c: Do not initialize blank nodes with rdf:type for instance selector component

## 0.2.1

### Patch Changes

- 8752a56: Add option to disable changing editors for all objects
- 06aa5eb: Property with sh:minCount>0 should have an initial empty value
- 76e0849: Allow setting a graph pointer for shapes
- 1fef3d1: Only AnyPointer worked when setting shapes

## 0.2.0

### Minor Changes

- e7348c4: Update @captaincodeman/rdx

## 0.1.1

### Patch Changes

- 5bbbc23: Fix packages but bundling build JS files

## 0.1.0

### Minor Changes

- 7787606: Added dash:DatePickerEditor and dash:DateTimePickerEditor matcher and components
- 2f14bb3: Update rdfine to 0.5 and clownface to 1.0

### Patch Changes

- b86f901: Use rdfs:label as default header
- 8659712: Enum editor should be chose over text field but only when value is one of the choices
- 8659712: Preserve the selected multi editor when recalculating form
- e517a63: Prevent selected editor when changing when updating resource
- b86f901: Show shape selector with all shapes is no matching found

## 0.0.1

### Patch Changes

- Initial version
