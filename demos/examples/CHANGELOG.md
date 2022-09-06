# @hydrofoil/shaperone-playground-examples

## 0.2.34

### Patch Changes

- Updated dependencies [683ae4b]
  - @hydrofoil/shaperone-core@0.9.7

## 0.2.33

### Patch Changes

- Updated dependencies [cb60db7]
  - @hydrofoil/shaperone-core@0.9.6

## 0.2.32

### Patch Changes

- Updated dependencies [572a38f]
  - @hydrofoil/shaperone-core@0.9.5
  - @hydrofoil/shaperone-wc@0.7.4

## 0.2.31

### Patch Changes

- Updated dependencies [76f55b0]
- Updated dependencies [604a1c0]
  - @hydrofoil/shaperone-core@0.9.4
  - @hydrofoil/shaperone-wc@0.7.3

## 0.2.30

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
  - @hydrofoil/shaperone-wc@0.7.2

## 0.2.29

### Patch Changes

- Updated dependencies [5099ddc]
- Updated dependencies [5099ddc]
  - @hydrofoil/shaperone-wc@0.7.1
  - @hydrofoil/shaperone-core@0.9.2

## 0.2.28

### Patch Changes

- Updated dependencies [5b8ed7f]
  - @hydrofoil/shaperone-core@0.9.1

## 0.2.27

### Patch Changes

- 7d6c3b4: Updated `@rdfjs-elements/lit-helpers` to 0.3.2
- Updated dependencies [7d6c3b4]
- Updated dependencies [7d6c3b4]
  - @hydrofoil/shaperone-core@0.9.0
  - @hydrofoil/shaperone-wc@0.7.0

## 0.2.26

### Patch Changes

- Updated dependencies [9be4ed0]
  - @hydrofoil/shaperone-wc@0.6.11

## 0.2.25

### Patch Changes

- 61ac785: Update `@tpluscode/rdf-ns-builders` to v2
- Updated dependencies [61ac785]
- Updated dependencies [bc6a5d6]
- Updated dependencies [bc6a5d6]
  - @hydrofoil/shaperone-core@0.8.8
  - @hydrofoil/shaperone-wc@0.6.10

## 0.2.24

### Patch Changes

- 09c9057: Support multi-lingual shape labels
- Updated dependencies [09c9057]
  - @hydrofoil/shaperone-core@0.8.7
  - @hydrofoil/shaperone-wc@0.6.9

## 0.2.23

### Patch Changes

- Updated dependencies [4f5fbd7]
  - @hydrofoil/shaperone-core@0.8.6
  - @hydrofoil/shaperone-wc@0.6.8

## 0.2.22

### Patch Changes

- Updated dependencies [e403709]
  - @hydrofoil/shaperone-core@0.8.5

## 0.2.21

### Patch Changes

- Updated dependencies [a7dc6b9]
- Updated dependencies [a7dc6b9]
  - @hydrofoil/shaperone-core@0.8.4

## 0.2.20

### Patch Changes

- Updated dependencies [130b191]
- Updated dependencies [130b191]
  - @hydrofoil/shaperone-core@0.8.3
  - @hydrofoil/shaperone-wc@0.6.7

## 0.2.19

### Patch Changes

- Updated dependencies [8551639]
  - @hydrofoil/shaperone-wc@0.6.6

## 0.2.18

### Patch Changes

- Updated dependencies [e05b7f8]
  - @hydrofoil/shaperone-wc@0.6.5

## 0.2.17

### Patch Changes

- 45c440c: Update lit to a non-RC version
- Updated dependencies [45c440c]
  - @hydrofoil/shaperone-wc@0.6.4

## 0.2.16

### Patch Changes

- Updated dependencies [c39d829]
  - @hydrofoil/shaperone-wc@0.6.3

## 0.2.15

### Patch Changes

- Updated dependencies [00c7661]
  - @hydrofoil/shaperone-wc@0.6.2

## 0.2.14

### Patch Changes

- Updated dependencies [0dbce33]
  - @hydrofoil/shaperone-core@0.8.2

## 0.2.13

### Patch Changes

- Updated dependencies [a5581fd]
- Updated dependencies [63e36f4]
  - @hydrofoil/shaperone-core@0.8.1
  - @hydrofoil/shaperone-wc@0.6.1

## 0.2.12

### Patch Changes

- 518a4eb: Not all errors were displayed in summary
- Updated dependencies [0ce3e61]
- Updated dependencies [0f1e31c]
- Updated dependencies [ca8803c]
  - @hydrofoil/shaperone-core@0.8.0
  - @hydrofoil/shaperone-wc@0.6.0

## 0.2.11

### Patch Changes

- Updated dependencies [096d202]
  - @hydrofoil/shaperone-core@0.7.4
  - @hydrofoil/shaperone-wc@0.5.2

## 0.2.10

### Patch Changes

- e20edd5: Update RDF/JS types, rdfine and @tpluscode/rdf-ns-builders
- Updated dependencies [e20edd5]
  - @hydrofoil/shaperone-core@0.7.3
  - @hydrofoil/shaperone-wc@0.5.1

## 0.2.9

### Patch Changes

- Updated dependencies [4ddb56a]
  - @hydrofoil/shaperone-core@0.7.2

## 0.2.8

### Patch Changes

- Updated dependencies [23a2b1a]
  - @hydrofoil/shaperone-core@0.7.1

## 0.2.7

### Patch Changes

- 4f5d6e2: Example sh:xone support in rendering
- Updated dependencies [3da25a3]
- Updated dependencies [e18978c]
- Updated dependencies [2b80867]
- Updated dependencies [7d86a50]
- Updated dependencies [0a4164b]
- Updated dependencies [e18978c]
- Updated dependencies [e2a3f31]
- Updated dependencies [e9b2b01]
  - @hydrofoil/shaperone-wc@0.5.0
  - @hydrofoil/shaperone-core@0.7.0

## 0.2.6

### Patch Changes

- @hydrofoil/shaperone-core@0.6.9
- @hydrofoil/shaperone-wc@0.4.6

## 0.2.5

### Patch Changes

- Updated dependencies [975accf]
- Updated dependencies [07e7ac2]
  - @hydrofoil/shaperone-wc@0.4.5
  - @hydrofoil/shaperone-core@0.6.8

## 0.2.4

### Patch Changes

- Updated dependencies [0c57318]
  - @hydrofoil/shaperone-core@0.6.7
  - @hydrofoil/shaperone-wc@0.4.4

## 0.2.3

### Patch Changes

- Updated dependencies [5cf78cd]
- Updated dependencies [7ecccb0]
  - @hydrofoil/shaperone-wc@0.4.3

## 0.2.2

### Patch Changes

- Updated dependencies [da63f75]
- Updated dependencies [90f84d7]
  - @hydrofoil/shaperone-core@0.6.6
  - @hydrofoil/shaperone-wc@0.4.2

## 0.2.1

### Patch Changes

- 1a02b63: Allow selecting shape when rendering focus node
- Updated dependencies [1a02b63]
- Updated dependencies [a66d4d6]
  - @hydrofoil/shaperone-core@0.6.5
  - @hydrofoil/shaperone-wc@0.4.1

## 0.2.0

### Minor Changes

- 69dd194: Example of inline nested form

### Patch Changes

- Updated dependencies [6172891]
- Updated dependencies [afd820c]
- Updated dependencies [6172891]
  - @hydrofoil/shaperone-wc@0.4.0
  - @hydrofoil/shaperone-core@0.6.4

## 0.1.5

### Patch Changes

- Updated dependencies [dceb137]
  - @hydrofoil/shaperone-core@0.6.3
  - @hydrofoil/shaperone-wc@0.3.5

## 0.1.4

### Patch Changes

- Updated dependencies [18ffe89]
- Updated dependencies [12e03f7]
- Updated dependencies [bada256]
  - @hydrofoil/shaperone-core@0.6.2
  - @hydrofoil/shaperone-wc@0.3.4

## 0.1.3

### Patch Changes

- Updated dependencies [1a4c2b3]
  - @hydrofoil/shaperone-core@0.6.1
  - @hydrofoil/shaperone-wc@0.3.3

## 0.1.2

### Patch Changes

- Updated dependencies [b851c1a]
- Updated dependencies [0b2feac]
- Updated dependencies [7b79795]
  - @hydrofoil/shaperone-core@0.6.0
  - @hydrofoil/shaperone-wc@0.3.2

## 0.1.1

### Patch Changes

- Updated dependencies [82ee36b]
- Updated dependencies [a783307]
- Updated dependencies [82ee36b]
  - @hydrofoil/shaperone-core@0.5.1
  - @hydrofoil/shaperone-wc@0.3.1

## 0.1.0

### Minor Changes

- c4c8b70: Added star rating element

### Patch Changes

- Updated dependencies [903ff67]
- Updated dependencies [5ee02a8]
- Updated dependencies [10b4345]
- Updated dependencies [8d401fa]
- Updated dependencies [f9f99a2]
- Updated dependencies [9d99c0c]
- Updated dependencies [65967a5]
- Updated dependencies [b3d5ca9]
- Updated dependencies [dadeff8]
  - @hydrofoil/shaperone-core@0.5.0
  - @hydrofoil/shaperone-wc@0.3.0

## 0.0.17

### Patch Changes

- Updated dependencies [cdf8707]
- Updated dependencies [fcd46be]
- Updated dependencies [9c4e7e3]
  - @hydrofoil/shaperone-core@0.4.4
  - @hydrofoil/shaperone-wc@0.2.6

## 0.0.16

### Patch Changes

- Updated dependencies [b91d81a]
  - @hydrofoil/shaperone-core@0.4.3
  - @hydrofoil/shaperone-wc@0.2.5

## 0.0.15

### Patch Changes

- Updated dependencies [8fae858]
- Updated dependencies [ac3df4e]
- Updated dependencies [f37b75d]
- Updated dependencies [a126971]
- Updated dependencies [6700fa9]
- Updated dependencies [b47bd64]
  - @hydrofoil/shaperone-core@0.4.2
  - @hydrofoil/shaperone-wc@0.2.4

## 0.0.14

### Patch Changes

- Updated dependencies [e831915]
  - @hydrofoil/shaperone-core@0.4.1
  - @hydrofoil/shaperone-wc@0.2.3

## 0.0.13

### Patch Changes

- Updated dependencies [93965e6]
- Updated dependencies [2b854ea]
- Updated dependencies [18c76d0]
- Updated dependencies [62d8742]
  - @hydrofoil/shaperone-core@0.4.0
  - @hydrofoil/shaperone-wc@0.2.2

## 0.0.12

### Patch Changes

- Updated dependencies [84d7b1e]
  - @hydrofoil/shaperone-core@0.3.1
  - @hydrofoil/shaperone-wc@0.2.1

## 0.0.11

### Patch Changes

- Updated dependencies [1772fd7]
  - @hydrofoil/shaperone-wc@0.2.0

## 0.0.10

### Patch Changes

- 627dd89: Horor the canAdd/canRemove flags in language multi select
- Updated dependencies [627dd89]
- Updated dependencies [c41966b]
- Updated dependencies [43039b8]
- Updated dependencies [58d647c]
- Updated dependencies [d8343b6]
  - @hydrofoil/shaperone-core@0.3.0
  - @hydrofoil/shaperone-wc@0.1.6

## 0.0.9

### Patch Changes

- Updated dependencies [1fdb3ca]
- Updated dependencies [9702fdd]
- Updated dependencies [c16e00b]
- Updated dependencies [3e34259]
- Updated dependencies [6a5b20e]
- Updated dependencies [7aad50c]
- Updated dependencies [aa9a943]
  - @hydrofoil/shaperone-core@0.2.4
  - @hydrofoil/shaperone-wc@0.1.5

## 0.0.8

### Patch Changes

- Updated dependencies [7c88a8b]
  - @hydrofoil/shaperone-core@0.2.3
  - @hydrofoil/shaperone-wc@0.1.4

## 0.0.7

### Patch Changes

- Updated dependencies [15203fc]
- Updated dependencies [d86891f]
- Updated dependencies [9073e8c]
- Updated dependencies [544acb4]
  - @hydrofoil/shaperone-core@0.2.2
  - @hydrofoil/shaperone-wc@0.1.3

## 0.0.6

### Patch Changes

- Updated dependencies [ba567ae]
  - @hydrofoil/shaperone-wc@0.1.2

## 0.0.5

### Patch Changes

- Updated dependencies [8752a56]
- Updated dependencies [06aa5eb]
- Updated dependencies [76e0849]
- Updated dependencies [1fef3d1]
  - @hydrofoil/shaperone-core@0.2.1
  - @hydrofoil/shaperone-wc@0.1.1

## 0.0.4

### Patch Changes

- Updated dependencies [e7348c4]
  - @hydrofoil/shaperone-core@0.2.0
  - @hydrofoil/shaperone-wc@0.1.0

## 0.0.3

### Patch Changes

- Updated dependencies [5bbbc23]
  - @hydrofoil/shaperone-core@0.1.1
  - @hydrofoil/shaperone-wc@0.0.3

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
  - @hydrofoil/shaperone-wc@0.0.2

## 0.0.1

### Patch Changes

- Initial version
- Updated dependencies [undefined]
  - @hydrofoil/shaperone-core@0.0.1
  - @hydrofoil/shaperone-wc@0.0.1
