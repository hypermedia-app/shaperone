import type { NamedNode } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'
import type { NodeShape, PropertyGroup, Shape } from '@rdfine/shacl'

export interface CustomEventTarget {
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: CustomEventTarget, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void

  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: CustomEventTarget, ev: HTMLElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void

  dispatchEvent<K extends keyof HTMLElementEventMap>(ev: CustomEvent<HTMLElementEventMap[K]>): boolean
}

declare global {
  interface HTMLElementEventMap {
    'value-changed': CustomEvent<{
      value: GraphPointer | NamedNode | string
    }>

    'group-selected': CustomEvent<{
      group: PropertyGroup
    }>

    'shape-selected': CustomEvent<{
      shape: NodeShape
    }>

    'property-hidden': CustomEvent<{
      shape: Shape
    }>

    'property-shown': CustomEvent<{
      shape: Shape
    }>

    'property-cleared': CustomEvent<{
      shape: Shape
    }>

    'editor-selected': CustomEvent<{
      editor: NamedNode
    }>

    'remove-object': CustomEvent<{
      editor: NamedNode
    }>

    'add-object': Event
  }
}
