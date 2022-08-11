---
"@hydrofoil/shaperone-playground-examples": patch
"@hydrofoil/shaperone-core": patch
"@hydrofoil/shaperone-hydra": patch
"@hydrofoil/shaperone-wc": patch
"@hydrofoil/shaperone-wc-material": patch
"@hydrofoil/shaperone-wc-shoelace": patch
"@hydrofoil/shaperone-wc-vaadin": patch
---

Change how `componentState` is accessed in calls to `render`, `init`, etc., which unifies implementations of single
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
