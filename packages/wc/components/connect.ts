/**
 * A modified version of the connect mixin from @captaincodeman/rdx which creates a new store for
 * each instance of the component.
 */

/* eslint-disable guard-for-in,no-restricted-syntax,symbol-description */
import type { Connectable, Store, Constructor, DispatchMap } from '@captaincodeman/rdx'
import { devtools } from '@hydrofoil/shaperone-core/store.js'
import { property } from 'lit/decorators.js'
import type { LitElement, PropertyValues } from 'lit'

const stateEvent = 'state'

const dispatchMap: unique symbol = Symbol()
const createDispatchMap: unique symbol = Symbol()
const addEventListeners: unique symbol = Symbol()
const removeEventListeners: unique symbol = Symbol()
const addStateSubscription: unique symbol = Symbol()
const removeStateSubscription: unique symbol = Symbol()
const onStateChange: unique symbol = Symbol()
const store: unique symbol = Symbol('store')
const storeRaw: unique symbol = Symbol()

export function connect<T extends Constructor<Connectable & LitElement>, S>(
  createStore: () => Store<S>,
  superclass: T,
) {
  class connected extends dispatchingElementMixin(superclass) {
    private [dispatchMap]!: DispatchMap
    private [store]: Store<S>
    private [storeRaw]: Store<S>

    get dispatch() {
      return this[store].dispatch
    }

    @property({ type: Boolean })
    public debug: boolean = false

    constructor(...args: any[]) {
      super(...args)
      this[storeRaw] = createStore()
      this[store] = this.debug ? devtools(this[storeRaw]) : this[storeRaw]
      this[onStateChange] = this[onStateChange].bind(this)
      this[createDispatchMap]()
    }

    updated(changedProps: PropertyValues) {
      if (changedProps.has('debug')) {
        this[store] = this.debug ? devtools(this[storeRaw]) : this[storeRaw]
      }
    }

    connectedCallback() {
      super.connectedCallback()
      this[addEventListeners]()
      this[addStateSubscription]()
    }

    disconnectedCallback() {
      this[removeStateSubscription]()
      this[removeEventListeners]()

      super.disconnectedCallback()
    }

    private [createDispatchMap]() {
      this[dispatchMap] = this.mapEvents
        ? this.mapEvents()
        : {}
    }

    private [addEventListeners]() {
      for (const key in this[dispatchMap]) {
        this[store].addEventListener(key, this[dispatchMap][key] as EventListener, false)
      }
    }

    private [removeEventListeners]() {
      for (const key in this[dispatchMap]) {
        this[store].removeEventListener(key, this[dispatchMap][key] as EventListener, false)
      }
    }

    private [addStateSubscription]() {
      this[store].addEventListener(stateEvent, this[onStateChange])
      this[onStateChange]()
    }

    private [removeStateSubscription]() {
      this[store].removeEventListener(stateEvent, this[onStateChange])
    }

    private [onStateChange]() {
      this.mapState && Object.assign(this, this.mapState(this[store].state))
    }
  }

  return connected as Constructor<Connectable> & T
}

function dispatchingElementMixin<T extends Constructor<LitElement>>(superclass: T) {
  return class extends superclass {
  }
}
