import type { NamedNode } from '@rdfjs/types'
import type { GraphPointer } from 'clownface'

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
  }
}
