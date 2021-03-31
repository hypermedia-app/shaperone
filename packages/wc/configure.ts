/**
 * Exports configuration objects used to set up shaperone
 *
 * @packageDocumentation
 * @module @hydrofoil/shaperone-wc/configure
 */

import { store } from './store'

export const { components } = store().dispatch
export const { renderer } = store().dispatch
export const { editors } = store().dispatch
export const { validation } = store().dispatch
