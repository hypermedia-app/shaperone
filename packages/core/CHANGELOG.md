# @hydrofoil/shaperone-core

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
