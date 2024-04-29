# @hydrofoil/shaperone-rdf-validate-shacl

## 1.1.1

### Patch Changes

- 40dd516: Build: fixes some incorrect imports in generated d.ts files

## 1.1.0

### Minor Changes

- e76afd5: Deprecated `validate.with`
- e76afd5: Use a centralised RDF/JS Environment

### Patch Changes

- e76afd5: Update RDF/JS-related dependencies (closes #300)

## 1.0.4

### Patch Changes

- 22242f5: Updated `rdf-validate-shacl`

## 1.0.3

### Patch Changes

- 50d4582: One more build fix, where babel tried to compile `.d.ts` files

## 1.0.2

### Patch Changes

- 55271d1: Babel build inadvertently caused TS typings to disappear from packages

## 1.0.1

### Patch Changes

- 572a38f: Ensure .js extensions are added to all imports. Previously, there were issues with strict ESM imports

## 1.0.0

### Major Changes

- e18978c: SHACL validation using [rdf-validate-shacl](https://npm.im/rdf-validate-shacl)
