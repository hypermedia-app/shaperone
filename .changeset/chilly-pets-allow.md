---
"@hydrofoil/shaperone-core": minor
---

Significant changes in handling translations:

- `Item` interface is removed. All translations should be directly retrieved from `GraphPointer` 
  objects wherever needed
- `languages` property removed from `FormSetting`. Instead, the current display language(s) are 
  sourced from `@rdfjs-elements/lit-helpers`. `navigator.languages` by default
- `label` function removed from interface of `dash:EnumSelectEditor` and 
  `dash:InstancesSelectEditor` since they will be dynamically rendered using the 
  `@rdfjs-elements/lit-helpers/localizedLabel.js` directive
