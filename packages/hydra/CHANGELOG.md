# @hydrofoil/shaperone-hydra

## 0.4.0

### Minor Changes

- e76afd5: Use a centralised RDF/JS Environment

### Patch Changes

- e76afd5: Update RDF/JS-related dependencies (closes #300)
- Updated dependencies [e76afd5]
- Updated dependencies [e76afd5]
- Updated dependencies [e76afd5]
  - @hydrofoil/shaperone-core@0.12.0

## 0.3.16

### Patch Changes

- Updated dependencies [7bb4047]
  - @hydrofoil/shaperone-core@0.11.0

## 0.3.15

### Patch Changes

- Updated dependencies [dff822d]
  - @hydrofoil/shaperone-core@0.10.0

## 0.3.14

### Patch Changes

- e8d1fc7: Use `sh:path` to select template value from arbitrary location in graph

## 0.3.13

### Patch Changes

- 50d4582: One more build fix, where babel tried to compile `.d.ts` files
- Updated dependencies [50d4582]
  - @hydrofoil/shaperone-core@0.9.9

## 0.3.12

### Patch Changes

- 55271d1: Babel build inadvertently caused TS typings to disappear from packages
- Updated dependencies [55271d1]
  - @hydrofoil/shaperone-core@0.9.8

## 0.3.11

### Patch Changes

- 572a38f: Ensure .js extensions are added to all imports. Previously, there were issues with strict ESM imports
- Updated dependencies [572a38f]
  - @hydrofoil/shaperone-core@0.9.5

## 0.3.10

### Patch Changes

- 604a1c0: Apply search decorator to multi instance editor
- Updated dependencies [76f55b0]
- Updated dependencies [604a1c0]
  - @hydrofoil/shaperone-core@0.9.4

## 0.3.9

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

## 0.3.8

### Patch Changes

- 5b8ed7f: The search decorator should now match both instances select and auto-complete
- Updated dependencies [5b8ed7f]
  - @hydrofoil/shaperone-core@0.9.1

## 0.3.7

### Patch Changes

- Updated dependencies [7d6c3b4]
  - @hydrofoil/shaperone-core@0.9.0

## 0.3.6

### Patch Changes

- 641a2d9: Update `@rdfine/hydra` - improves base URI resolution for template expansion
- 722146c: Search template would not consider named parent resources as template base context
- 357d59f: Add a main module for quick setup

## 0.3.5

### Patch Changes

- fbafb81: Instance selector with templated `hydra:search` should construct search URIs from multiple related focus nodes when selected `sh:path`

  For example, given a focus node like

  ```turtle
  prefix ex: <http://example.org/>

  [
      ex:child [ ex:name "John" ] ;
      ex:child [ ex:name "Jane" ] ;
  ] .
  ```

  And property shape

  ```turtle
  prefix ex: <http://example.org/>
  prefix sh: <http://www.w3.org/ns/shacl#>
  prefix hydra: <http://www.w3.org/ns/hydra/core#>

  [
    hydra:search
      [
        sh:path ex:child ;
        hydra:template "{?name}" ;
        hydra:mapping
          [
            hydra:variable "name" ;
            hydra:property ex:name ;
          ] ;
      ] ;
  ] .
  ```

  A constructed URL would combine both names from both child nodes to expand into `?name=John,Jane`

## 0.3.4

### Patch Changes

- 61ac785: Update `@tpluscode/rdf-ns-builders` to v2
- Updated dependencies [61ac785]
- Updated dependencies [bc6a5d6]
- Updated dependencies [bc6a5d6]
  - @hydrofoil/shaperone-core@0.8.8

## 0.3.3

### Patch Changes

- fa62a3e: bump alcaeus to 2.2.0

## 0.3.2

### Patch Changes

- f3ccf37: Update alcaeus

## 0.3.1

### Patch Changes

- b302cda: Update alcaeus and @rdfine/hydra

## 0.3.0

### Minor Changes

- 0f1e31c: Update to `lit@2`

### Patch Changes

- Updated dependencies [0ce3e61]
  - @hydrofoil/shaperone-core@0.8.0

## 0.2.3

### Patch Changes

- 096d202: Update rdfine packages
- Updated dependencies [096d202]
  - @hydrofoil/shaperone-core@0.7.4

## 0.2.2

### Patch Changes

- Updated dependencies [c00a12a]
- Updated dependencies [3adb204]
  - clownface-shacl-path@1.1.0

## 0.2.1

### Patch Changes

- e20edd5: Update RDF/JS types, rdfine and @tpluscode/rdf-ns-builders
- Updated dependencies [e20edd5]
  - clownface-shacl-path@1.0.2
  - @hydrofoil/shaperone-core@0.7.3

## 0.2.0

### Minor Changes

- 4ddb56a: Collection filtering using `hydra:freetextQuery`

### Patch Changes

- 7de8900: `dash:InstancesSelectEditor`: Instances could be loaded from incorrect constructed URI
- Updated dependencies [4ddb56a]
  - @hydrofoil/shaperone-core@0.7.2

## 0.1.9

### Patch Changes

- Updated dependencies [2b80867]
- Updated dependencies [7d86a50]
- Updated dependencies [0a4164b]
- Updated dependencies [0a4164b]
- Updated dependencies [e18978c]
- Updated dependencies [e2a3f31]
- Updated dependencies [e9b2b01]
  - @hydrofoil/shaperone-core@0.7.0
  - clownface-shacl-path@1.0.1

## 0.1.8

### Patch Changes

- Updated dependencies [1f178e4]
  - clownface-shacl-path@1.0.0
  - @hydrofoil/shaperone-core@0.6.9

## 0.1.7

### Patch Changes

- a184985: Use sh:path to point to another focus node for search template variables
- da63f75: Mark packages ES module
- Updated dependencies [da63f75]
  - @hydrofoil/shaperone-core@0.6.6

## 0.1.6

### Patch Changes

- ebf533a: Same collection used by multiple fields would fire the exact same request in parallel
- Updated dependencies [6172891]
  - @hydrofoil/shaperone-core@0.6.4

## 0.1.5

### Patch Changes

- Updated dependencies [b851c1a]
- Updated dependencies [0b2feac]
- Updated dependencies [7b79795]
  - @hydrofoil/shaperone-core@0.6.0

## 0.1.4

### Patch Changes

- Updated dependencies [903ff67]
- Updated dependencies [5ee02a8]
- Updated dependencies [10b4345]
- Updated dependencies [8d401fa]
- Updated dependencies [65967a5]
- Updated dependencies [b3d5ca9]
  - @hydrofoil/shaperone-core@0.5.0

## 0.1.3

### Patch Changes

- cdee1a8: Do not export namespace

## 0.1.2

### Patch Changes

- fcd46be: Package as es modules and not commonjs
- 7f93786: Dyncamically load instances using hydra:search
- Updated dependencies [cdf8707]
- Updated dependencies [fcd46be]
- Updated dependencies [9c4e7e3]
  - @hydrofoil/shaperone-core@0.4.4

## 0.1.1

### Patch Changes

- 16a4822: Do not cache fetched collections
- Updated dependencies [b91d81a]
  - @hydrofoil/shaperone-core@0.4.3

## 0.1.0

### Minor Changes

- b47bd64: First version - instances select backed by hydra:Collection

### Patch Changes

- Updated dependencies [8fae858]
- Updated dependencies [ac3df4e]
- Updated dependencies [f37b75d]
- Updated dependencies [a126971]
- Updated dependencies [6700fa9]
- Updated dependencies [b47bd64]
  - @hydrofoil/shaperone-core@0.4.2
